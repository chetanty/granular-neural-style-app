import { useState, useRef, useCallback } from "react";

const API_URL = "/api";

const LAYER_LABELS = [
  { id: "l1", name: "relu1_1", desc: "Fine texture" },
  { id: "l2", name: "relu2_1", desc: "Small patterns" },
  { id: "l3", name: "relu3_1", desc: "Mid-level shapes" },
  { id: "l4", name: "relu4_1", desc: "Large structures" },
  { id: "l5", name: "relu5_1", desc: "Global composition" },
];

function ImageDropzone({ label, onImage, preview }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImage({ dataUrl: e.target.result, b64: e.target.result.split(",")[1] });
    reader.readAsDataURL(file);
  }, [onImage]);

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        border: `1.5px dashed ${dragging ? "var(--color-border-primary)" : "var(--color-border-secondary)"}`,
        borderRadius: "var(--border-radius-lg)",
        background: dragging ? "var(--color-background-secondary)" : "var(--color-background-primary)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 180,
        overflow: "hidden",
        transition: "background 0.15s",
        position: "relative",
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      {preview ? (
        <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
      ) : (
        <div style={{ textAlign: "center", padding: "1.5rem", pointerEvents: "none" }}>
          <div style={{ width: 32, height: 32, margin: "0 auto 12px", borderRadius: "50%", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M4 6l4-4 4 4M2 13h12" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>{label}</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>click or drag</p>
        </div>
      )}
    </div>
  );
}

function WeightSlider({ layer, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{layer.name}</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{layer.desc}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", minWidth: 32, textAlign: "right" }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range" min="0" max="1" step="0.01" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function ResultPanel({ content, style, output, loading, progress }) {
  const download = () => {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${output}`;
    a.download = "stylized.png";
    a.click();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 260, gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "2px solid var(--color-border-secondary)", borderTopColor: "var(--color-text-primary)", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{progress}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!output && !content?.dataUrl) return null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "content", src: content?.dataUrl },
          { label: "style", src: style?.dataUrl },
          { label: "output", src: output ? `data:image/png;base64,${output}` : null },
        ].map(({ label, src }) => (
          <div key={label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", overflow: "hidden", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {src ? (
              <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{label}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["content", "style", "output"].map((l) => (
            <span key={l} style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{l}</span>
          ))}
        </div>
        {output && (
          <button onClick={download} style={{ fontSize: 13 }}>
            download png
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState(null);
  const [style, setStyle] = useState(null);
  const [weights, setWeights] = useState([0.5, 0.3, 0.1, 0.05, 0.05]);
  const [numSteps, setNumSteps] = useState(300);
  const [styleWeight, setStyleWeight] = useState(1000000);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState(null);

  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const run = async () => {
    if (!content || !style) { setError("Upload both images first."); return; }
    setError(null);
    setOutput(null);
    setLoading(true);
    setProgress("Sending to server...");
    try {
      const res = await fetch(`${API_URL}/stylize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_b64: content.b64,
          style_b64: style.b64,
          style_layer_weights: weights,
          num_steps: numSteps,
          style_weight: styleWeight,
          content_weight: 1,
        }),
      });
      setProgress("Optimizing... (this takes a minute)");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }
      const data = await res.json();
      setOutput(data.output_b64);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const setWeight = (i, v) => {
    const next = [...weights];
    next[i] = v;
    setWeights(next);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>granular neural style transfer</h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>per-layer style control via LWSW — upload, tune, run</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--color-text-secondary)" }}>content image</p>
          <ImageDropzone label="content" onImage={setContent} preview={content?.dataUrl} />
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--color-text-secondary)" }}>style image</p>
          <ImageDropzone label="style" onImage={setStyle} preview={style?.dataUrl} />
        </div>
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>layer-wise style weights (LWSW)</p>
          <span style={{ fontSize: 12, color: totalWeight > 0 ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
            total: {totalWeight.toFixed(2)}
          </span>
        </div>
        {LAYER_LABELS.map((layer, i) => (
          <WeightSlider key={layer.id} layer={layer} value={weights[i]} onChange={(v) => setWeight(i, v)} />
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 500 }}>optimization settings</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>iterations</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{numSteps}</span>
            </div>
            <input type="range" min="100" max="1000" step="50" value={numSteps} onChange={(e) => setNumSteps(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>style weight</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{styleWeight.toLocaleString()}</span>
            </div>
            <input type="range" min="10000" max="10000000" step="10000" value={styleWeight} onChange={(e) => setStyleWeight(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-danger)" }}>{error}</p>
        </div>
      )}

      <button
        onClick={run}
        disabled={loading || !content || !style}
        style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 500, marginBottom: "1.5rem", opacity: (loading || !content || !style) ? 0.5 : 1, cursor: (loading || !content || !style) ? "not-allowed" : "pointer" }}
      >
        {loading ? "running..." : "run style transfer"}
      </button>

      {(loading || output || content) && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
          <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 500 }}>result</p>
          <ResultPanel content={content} style={style} output={output} loading={loading} progress={progress} />
        </div>
      )}
    </div>
  );
}
