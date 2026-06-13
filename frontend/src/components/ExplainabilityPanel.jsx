import { Brain, Eye, Layers } from "lucide-react";
import "./PlaceholderPanel.css";

function ExplainabilityPanel() {
  return (
    <div className="card">
      <div className="card-header">
        <Brain /> Explainability
      </div>
      <div className="card-body">
        <div className="placeholder-body">
          <Brain />
          <div className="placeholder-title">Explainability Module Ready for Integration</div>
          <div className="placeholder-text">
            Grad-CAM attention heatmap and spectrogram overlay will be displayed here once the backend explainability endpoint is connected.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{
            flex: 1, padding: "10px 12px", borderRadius: "var(--radius-md)",
            background: "var(--bg-2)", border: "1px solid var(--border-0)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-2)", marginBottom: 2 }}>
              <Eye size={12} /> Spectrogram View
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)" }}>
              Acoustic signal visualization area
            </div>
          </div>
          <div style={{
            flex: 1, padding: "10px 12px", borderRadius: "var(--radius-md)",
            background: "var(--bg-2)", border: "1px solid var(--border-0)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-2)", marginBottom: 2 }}>
              <Layers size={12} /> Attention Heatmap
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)" }}>
              Model attention visualization area
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplainabilityPanel;
