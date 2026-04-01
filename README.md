# Granular Neural Style Transfer

A web app for neural style transfer with per-layer weight control. Upload a content image and a style image, tune how much each VGG-19 layer contributes to the style, and generate a stylized output.

Built with FastAPI + PyTorch (backend) and React + Vite (frontend).

---

## How it works

Style is extracted from five VGG-19 layers (`relu1_1` through `relu5_1`). Each layer captures a different level of detail:

| Layer | Captures |
|---|---|
| relu1_1 | Fine textures, brushstrokes |
| relu2_1 | Small repeated patterns |
| relu3_1 | Mid-level shapes |
| relu4_1 | Large structures |
| relu5_1 | Global composition |

The sliders let you set independent weights for each layer (layer-wise style weights / LWSW). The backend normalizes them automatically so they don't need to sum to 1.

---

## Requirements

- Python 3.10+
- Node.js 18+
- ~2GB RAM (VGG-19 loads into memory on startup)
- GPU optional but recommended (CPU runs are slow, ~3–5 min per transfer)

---

## Running locally

### 1. Backend

```bash
cd a1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

The first run downloads VGG-19 weights (~550MB). Subsequent runs load from cache.

### 2. Frontend

```bash
cd a1/nst-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Usage

1. Drop or click to upload a **content image** (the photo you want to stylize)
2. Drop or click to upload a **style image** (the painting or artwork)
3. Adjust the five **LWSW sliders**, higher early layers = finer texture; higher late layers = broader structural style
4. Set **iterations** (300 is a good default; more iterations = better quality, slower)
5. Set **style weight** (higher = more stylized, lower = closer to original content)
6. Click **run style transfer**
7. Download the result as PNG

---

## Running on Google Colab (free GPU)

Upload `main.py` and `requirements.txt` to your Colab session, then run:

```python
!pip install fastapi uvicorn pyngrok pillow torch torchvision
!ngrok authtoken YOUR_NGROK_TOKEN  # get a free token at ngrok.com

from pyngrok import ngrok
import subprocess, threading

def run_server():
    subprocess.run(["python", "-m", "uvicorn", "main:app", "--port", "8000"])

threading.Thread(target=run_server, daemon=True).start()

import time; time.sleep(3)
url = ngrok.connect(8000)
print("Backend URL:", url)
```

Copy the printed URL and set `API_URL` in `nst-app/src/App.jsx` to it, then run the frontend locally as above.

---

## Project structure

```
a1/
├── main.py              # FastAPI backend, VGG-19, L-BFGS optimization
├── requirements.txt     # Python dependencies
├── App.jsx              # Standalone React component (reference copy)
└── nst-app/
    ├── src/
    │   ├── App.jsx      # Main React app
    │   └── index.css    # CSS variables and base styles
    ├── vite.config.js   # Vite config with proxy to backend
    └── package.json
```
