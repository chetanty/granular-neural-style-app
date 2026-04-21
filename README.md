# Granular Neural Style Transfer

**Apply style with precision. Preserve what matters.**

Demo: https://chetantyagi.com/nst/

Report: https://drive.google.com/file/d/1851d046CYIswlDDpk5-W-HsIPgTG-niI

Granular Neural Style Transfer is a controllable neural style transfer system that allows you to decide how style is applied across different levels of visual detail.

Instead of applying style as a fixed filter, this system gives you direct control over texture, structure, and composition.

---

## What This Project Is

Most style transfer tools produce results, but offer little control.

They apply style uniformly across the entire image, often distorting structure or over-stylizing important elements.

This project takes a different approach.

It introduces **layer-wise control**, allowing you to guide how style is distributed across your image. This is especially useful for structured workflows such as comics, illustrations, and sequential art.

You provide:
- a content image
- a style reference
- a set of layer controls

The system produces an output that respects both structure and artistic intent.

---

## How It Works

### 1. Input Your Images

Start with:
- a **content image** that defines structure
- a **style image** that defines visual appearance

These form the foundation of the stylization process.

---

### 2. Understand the Image

A pretrained VGG-19 network analyzes the image at multiple levels.

- shallow layers capture fine details such as strokes and texture  
- deeper layers capture shapes, layout, and composition  

Style is not copied directly. It is represented through relationships between features.

---

### 3. Control the Style

Traditional neural style transfer uses a single global parameter:


L_style = α Σ E_l


This project introduces a more flexible formulation:


L_style = Σ α_l E_l


Each layer has its own weight.

This allows you to:
- enhance texture without breaking structure  
- shift overall composition without affecting detail  
- control exactly how style is applied  

The interface sliders directly control these weights.

---

### 4. Optimization

The system generates a stylized image by minimizing:


L(x) = L_content + L_style


- content loss keeps your image recognizable  
- style loss applies the artistic characteristics  

The image is refined iteratively until both are balanced.

---

### 5. Live Feedback

While the image is being generated, live logs can display:

- current iteration  
- style loss  
- content loss  
- total loss  
- layer weight configuration  

This makes the process transparent and easier to understand.

---

### 6. Output

The final result preserves the original structure while applying style in a controlled and predictable way.

---

## Controls

### Layer-Wise Style Controls

Each slider corresponds to a level of visual abstraction:

| Layer     | Effect |
|----------|--------|
| relu1_1  | Fine texture |
| relu2_1  | Small patterns |
| relu3_1  | Mid-level features |
| relu4_1  | Large structures |
| relu5_1  | Global composition |

#### What this means in practice

- **relu1_1** enhances line texture and surface detail  
- **relu2_1** strengthens small repeated patterns  
- **relu3_1** adjusts mid-level forms and grouping  
- **relu4_1** affects larger regions such as backgrounds  
- **relu5_1** shifts overall visual style and composition  

---

### Style Strength

Controls how strongly the style is applied.

- higher values increase stylization  
- lower values preserve original structure  

---

### Iterations

Controls how long the system refines the image.

- more iterations improve quality  
- fewer iterations are faster  

---

## Model Comparison

### Standard Neural Style Transfer

- single global style weight  
- uniform stylization  
- limited control  

---

### Layer-Wise Style Weighting (This Project)

- independent weights per layer  
- control over texture and structure  
- more predictable and adjustable results  

This layer-wise formulation is the core contribution of the project.

---

## Stylization Configurations (Illustrative)

These are examples of how the system can be used. They are not separate models.

### Fine-Grain Configuration
- emphasize shallow layers  
Result: detailed texture, clear structure  

---

### Balanced Configuration
- distribute weights evenly  
Result: natural blend of texture and structure  

---

### Abstract Configuration
- emphasize deeper layers  
Result: stronger transformation of overall composition  

These configurations demonstrate how adjusting layer weights changes the result.

---

## Architecture


Frontend React (App.jsx) User interface and controls
Backend FastAPI + PyTorch Style transfer engine


---

## Data Flow


Upload images
|
v
Convert to tensors
|
v
Extract features with VGG-19
|
v
Compute losses
|
v
Optimize image iteratively
|
v
Return stylized output


---

## Loss Functions

### Content Loss

Preserves the structure of the original image.

---

### Style Loss

Transfers artistic appearance using feature relationships.

---

### Layer-Wise Style Loss


L_style = Σ α_l E_l


Each layer contributes independently, enabling multi-scale control.

---

## Why This Matters

This approach is useful when structure matters as much as style.

It supports:
- consistent character rendering across panels  
- controlled shading and texture application  
- maintaining readability while applying artistic style  

Instead of applying a filter, you guide the stylization process.

---

## What This Is Not

- not a real-time filter  
- not a one-click effect  
- not designed for uncontrolled outputs  

This system prioritizes control and predictability.

---

## Project Structure


granular-neural-style-app/
nst-app/
src/
App.jsx
backend/
main.py


---

Granular Neural Style Transfer brings precision and control to neural stylization.
