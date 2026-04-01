import io
import base64
import copy
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
imsize = 512 if torch.cuda.is_available() else 256

loader = transforms.Compose([
    transforms.Resize((imsize, imsize)),
    transforms.ToTensor(),
])

cnn_normalization_mean = torch.tensor([0.485, 0.456, 0.406]).to(device)
cnn_normalization_std  = torch.tensor([0.229, 0.224, 0.225]).to(device)

print(f"Loading VGG-19 on {device}...")
cnn = models.vgg19(weights="DEFAULT").features.to(device).eval()
print("VGG-19 ready.")


def b64_to_tensor(b64: str) -> torch.Tensor:
    data = base64.b64decode(b64)
    img = Image.open(io.BytesIO(data)).convert("RGB")
    return loader(img).unsqueeze(0).to(device, torch.float)


def tensor_to_b64(tensor: torch.Tensor) -> str:
    img = tensor.cpu().clone().squeeze(0)
    img = transforms.ToPILImage()(img.clamp(0, 1))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


class ContentLoss(nn.Module):
    def __init__(self, target):
        super().__init__()
        self.target = target.detach()
        self.loss = torch.tensor(0.0)

    def forward(self, x):
        self.loss = F.mse_loss(x, self.target)
        return x


def gram_matrix(x):
    a, b, c, d = x.size()
    f = x.view(a * b, c * d)
    G = torch.mm(f, f.t())
    return G.div(a * b * c * d)


class StyleLoss(nn.Module):
    def __init__(self, target_feature, layer_weight=1.0):
        super().__init__()
        self.target = gram_matrix(target_feature).detach()
        self.layer_weight = layer_weight
        self.loss = torch.tensor(0.0)

    def forward(self, x):
        G = gram_matrix(x)
        self.loss = self.layer_weight * F.mse_loss(G, self.target)
        return x


class Normalization(nn.Module):
    def __init__(self):
        super().__init__()
        self.mean = cnn_normalization_mean.clone().detach().view(-1, 1, 1)
        self.std  = cnn_normalization_std.clone().detach().view(-1, 1, 1)

    def forward(self, img):
        return (img - self.mean) / self.std


STYLE_LAYERS   = ["conv_1", "conv_3", "conv_5", "conv_9", "conv_13"]
CONTENT_LAYERS = ["conv_10"]


def build_model(style_img, content_img, style_weights):
    norm = Normalization().to(device)
    content_losses, style_losses = [], []
    model = nn.Sequential(norm)
    i = 0
    for layer in copy.deepcopy(cnn).children():
        if isinstance(layer, nn.Conv2d):
            i += 1; name = f"conv_{i}"
        elif isinstance(layer, nn.ReLU):
            name = f"relu_{i}"; layer = nn.ReLU(inplace=False)
        elif isinstance(layer, nn.MaxPool2d):
            name = f"pool_{i}"; layer = nn.AvgPool2d(2, 2)
        elif isinstance(layer, nn.BatchNorm2d):
            name = f"bn_{i}"
        else:
            continue
        model.add_module(name, layer)
        if name in CONTENT_LAYERS:
            t = model(content_img).detach()
            cl = ContentLoss(t); model.add_module(f"content_loss_{i}", cl)
            content_losses.append(cl)
        if name in STYLE_LAYERS:
            t = model(style_img).detach()
            w = style_weights[STYLE_LAYERS.index(name)]
            sl = StyleLoss(t, w); model.add_module(f"style_loss_{i}", sl)
            style_losses.append(sl)
    for j in range(len(model) - 1, -1, -1):
        if isinstance(model[j], (ContentLoss, StyleLoss)):
            break
    return model[: j + 1], style_losses, content_losses


class StyleRequest(BaseModel):
    content_b64: str
    style_b64: str
    style_layer_weights: List[float] = [0.2, 0.2, 0.2, 0.2, 0.2]
    num_steps: int = 300
    style_weight: float = 1_000_000
    content_weight: float = 1


@app.post("/stylize")
async def stylize(req: StyleRequest):
    if len(req.style_layer_weights) != 5:
        raise HTTPException(400, "style_layer_weights must have exactly 5 values")
    total = sum(req.style_layer_weights)
    if total == 0:
        raise HTTPException(400, "weights must not all be zero")
    normalized_weights = [w / total for w in req.style_layer_weights]

    try:
        content_img = b64_to_tensor(req.content_b64)
        style_img   = b64_to_tensor(req.style_b64)
    except Exception as e:
        raise HTTPException(400, f"Invalid image data: {e}")

    input_img = content_img.clone()
    input_img.requires_grad_(True)

    model, style_losses, content_losses = build_model(style_img, content_img, normalized_weights)
    model.requires_grad_(False)
    optimizer = optim.LBFGS([input_img])

    run = [0]
    while run[0] <= req.num_steps:
        def closure():
            with torch.no_grad():
                input_img.clamp_(0, 1)
            optimizer.zero_grad()
            model(input_img)
            s_score = sum(sl.loss for sl in style_losses) * req.style_weight
            c_score = sum(cl.loss for cl in content_losses) * req.content_weight
            loss = s_score + c_score
            loss.backward()
            run[0] += 1
            return loss
        optimizer.step(closure)

    with torch.no_grad():
        input_img.clamp_(0, 1)

    return {"output_b64": tensor_to_b64(input_img)}


@app.get("/health")
def health():
    return {"status": "ok", "device": str(device)}
