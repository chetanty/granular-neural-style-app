export default function Docs({ onBack }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.25rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>documentation</h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>
            layer-wise style weighting — how it works
          </p>
        </div>
        <button onClick={onBack} style={{ fontSize: 13, padding: "6px 14px", background: "transparent", color: "var(--color-text-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)" }}>
          back to app
        </button>
      </div>

      {/* Abstract */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>abstract</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            Neural Style Transfer (NST) synthesizes images by recombining structural content with artistic style using deep convolutional neural networks. In standard formulations, style loss is aggregated uniformly across multiple convolutional layers, limiting explicit control over spatial-scale contributions. We propose a <strong style={{ color: "var(--color-text-primary)" }}>Layer-Wise Style Weighting (LWSW)</strong> framework that introduces independent coefficients for each selected VGG-19 feature layer. Because shallow layers encode fine textures while deeper layers capture higher-level abstractions, redistributing their contributions enables controllable transitions between texture-dominant and structure-dominant stylization.
          </p>
        </div>
      </section>

      {/* Example images */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>example</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { src: "/docs/content.jpg", label: "content", caption: "Tübingen, Germany" },
            { src: "/docs/style.jpg",   label: "style",   caption: "The Starry Night — Van Gogh" },
            { src: "/docs/stylized.png", label: "output", caption: "stylized result" },
          ].map(({ src, label, caption }) => (
            <div key={label}>
              <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", overflow: "hidden", aspectRatio: "1/1" }}>
                <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center" }}>{caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>introduction</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem" }}>
          <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            NST demonstrated that deep convolutional networks implicitly separate content and style representations. Content is preserved through high-level feature activations, while style is encoded through second-order feature correlations captured by <strong style={{ color: "var(--color-text-primary)" }}>Gram matrices</strong>.
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            In conventional NST, style loss is computed across multiple convolutional layers and combined using a single global coefficient. Convolutional neural networks are inherently hierarchical — early layers capture low-level textures and deeper layers encode larger-scale abstractions.
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            Because receptive field sizes increase with depth, uniform aggregation of style losses restricts fine-grained control over spatial-scale stylization. LWSW introduces a layer-wise weighting mechanism to explicitly exploit this hierarchy and enable interpretable multi-scale stylization control.
          </p>
        </div>
      </section>

      {/* VGG-19 layer table */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>VGG-19 style layers</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
          {[
            { layer: "relu1_1", depth: "shallow", role: "Fine texture — brush strokes, grain, fine detail" },
            { layer: "relu2_1", depth: "shallow", role: "Small patterns — repeating motifs, colour patches" },
            { layer: "relu3_1", depth: "mid",     role: "Mid-level shapes — edges, regional structure" },
            { layer: "relu4_1", depth: "deep",    role: "Large structures — spatial composition" },
            { layer: "relu5_1", depth: "deep",    role: "Global composition — high-level abstraction" },
          ].map(({ layer, depth, role }, i, arr) => (
            <div key={layer} style={{ display: "grid", gridTemplateColumns: "100px 70px 1fr", gap: 0, padding: "10px 1.25rem", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "monospace" }}>{layer}</span>
              <span style={{ fontSize: 12, color: depth === "shallow" ? "var(--color-text-success)" : depth === "deep" ? "var(--color-text-danger)" : "var(--color-text-secondary)" }}>{depth}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>methodology</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem" }}>
          <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            Stylization is formulated as feature-space optimization over total loss:
          </p>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 16px", marginBottom: 16, fontFamily: "monospace", fontSize: 13, color: "var(--color-text-primary)" }}>
            L(x) = L_content + L_style
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Standard NST</strong> applies a single global scalar across all style layers:
          </p>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 16px", marginBottom: 16, fontFamily: "monospace", fontSize: 13, color: "var(--color-text-primary)" }}>
            L_style = α · Σ E_l
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text-primary)" }}>LWSW</strong> replaces this with per-layer coefficients:
          </p>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 16px", fontFamily: "monospace", fontSize: 13, color: "var(--color-text-primary)" }}>
            L_style = Σ α_l · E_l
          </div>
        </div>
      </section>

      {/* Stylization profiles */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>stylization profiles</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { name: "fine-grain", weights: [0.6, 0.3, 0.07, 0.02, 0.01], desc: "Shallow layers dominate. Emphasises fine brush strokes, grain, and surface texture. Structure from the content image remains clearly legible." },
            { name: "balanced",   weights: [0.2, 0.2, 0.2, 0.2, 0.2],   desc: "Uniform weighting across all layers. Style influence is spread evenly across spatial scales — the default starting point." },
            { name: "abstract",   weights: [0.01, 0.02, 0.07, 0.3, 0.6], desc: "Deep layers dominate. Emphasises large-scale compositional structure and colour fields. Local texture is subdued." },
          ].map(({ name, weights, desc }) => (
            <div key={name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>{name}</p>
              <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                {weights.map((w, i) => (
                  <div key={i} style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden", height: 36, display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${w * 100}%`, background: "var(--color-text-primary)", borderRadius: 2 }} />
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>how to use</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
          {[
            { step: "1", title: "Upload images", body: "Drag or click to upload a content image (the photo whose structure you want to keep) and a style image (the artwork whose texture you want to apply)." },
            { step: "2", title: "Set layer weights", body: "Adjust the five LWSW sliders. Each one controls how much a VGG-19 layer contributes to the style loss. Higher weight on relu1_1 gives fine texture; higher weight on relu5_1 gives abstract structure." },
            { step: "3", title: "Tune optimization", body: "Iterations controls how long the optimizer runs — more steps generally improve quality at the cost of time. Style weight controls the overall strength of the style relative to content." },
            { step: "4", title: "Run", body: "Click run style transfer. The server processes the request synchronously using LBFGS optimization. When complete, the output appears alongside the inputs for comparison." },
          ].map(({ step, title, body }, i, arr) => (
            <div key={step} style={{ display: "grid", gridTemplateColumns: "40px 1fr", padding: "14px 1.25rem", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", gap: 12, alignItems: "start" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", paddingTop: 1 }}>{step}</span>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>{title}</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section style={{ marginBottom: "2rem" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>evaluation metrics</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { name: "LPIPS", desc: "Learned Perceptual Image Patch Similarity. Measures perceptual distance between the stylized output and the content image using deep features. Lower = more content-faithful." },
            { name: "SSIM", desc: "Structural Similarity Index. Captures luminance, contrast, and structural similarity. Used to evaluate how well content structure is preserved under stylization." },
          ].map(({ name, desc }) => (
            <div key={name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 500, fontFamily: "monospace" }}>{name}</p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Authors */}
      <section>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>paper</p>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500 }}>Layer-Wise Weighting for Granular Control in Neural Artistic Stylization</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>Chetan Tyagi &amp; Linh Le — University of Alberta, February 2026</p>
          </div>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>CMPUT 414</span>
        </div>
      </section>

    </div>
  );
}
