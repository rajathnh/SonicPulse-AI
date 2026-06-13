import { Brain, Layers } from "lucide-react";
import "./PlaceholderPanel.css";

const API_BASE = "http://127.0.0.1:8000";

function ExplainabilityPanel({ result }) {
  return (
    <div className="card">
      <div className="card-header">
        <Brain /> Explainability
      </div>

      <div className="card-body">
        {!result?.gradcam ? (
          <div className="placeholder-body">
            <Brain />
            <div className="placeholder-title">
              Explainability Module Ready for Integration
            </div>
            <div className="placeholder-text">
              Upload an audio sample and run inference to generate
              the Grad-CAM attention map.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border-0)",
              borderRadius: "var(--radius-md)",
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Layers size={14} />
              Grad-CAM Attention Heatmap
            </div>

            <img
              src={`${API_BASE}/results/${result.gradcam}`}
              alt="Grad-CAM"
              style={{
                width: "100%",
                borderRadius: 8,
                display: "block",
              }}
            />

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--text-2)",
              }}
            >
              Red regions indicate areas of the spectrogram that
              contributed most strongly to the model's anomaly
              prediction.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplainabilityPanel;