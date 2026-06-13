import { useEffect, useState } from "react";
import { BarChart3, ShieldCheck, ShieldAlert } from "lucide-react";
import "./ResultCard.css";

function ConfidenceGauge({ confidence, isNormal }) {
  const [offset, setOffset] = useState(251.3);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pct = Math.round(confidence * 100);

  useEffect(() => {
    // Small delay so the CSS transition is visible
    const t = setTimeout(() => {
      setOffset(circ - (confidence * circ));
    }, 60);
    return () => clearTimeout(t);
  }, [confidence, circ]);

  return (
    <div className="gauge-container">
      <svg className="gauge-svg" viewBox="0 0 100 100">
        <circle className="gauge-bg" cx="50" cy="50" r={r} />
        <circle
          className={`gauge-fill ${isNormal ? "normal" : "abnormal"}`}
          cx="50" cy="50" r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-label">
        <span className="gauge-pct">{pct}</span>
        <span className="gauge-unit">%</span>
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  const hasResult = result !== null;
  const isNormal = result?.prediction === "normal";

  return (
    <div className="card">
      <div className="card-header">
        <BarChart3 /> Prediction Result
      </div>
      <div className="card-body">
        {!hasResult ? (
          <div className="result-empty">
            <BarChart3 />
            <p>Results will appear here after analysis.</p>
          </div>
        ) : (
          <div className="result-body">
            <div className="result-info">
              <span className={`status-badge ${isNormal ? "normal" : "abnormal"}`}>
                <span className="status-dot" />
                {isNormal ? "Normal" : "Abnormal"}
              </span>

              <div className="result-prediction">
                {isNormal ? (
                  <><ShieldCheck size={18} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />Normal Operation</>
                ) : (
                  <><ShieldAlert size={18} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />Anomaly Detected</>
                )}
              </div>

              <div className="confidence-section">
                <div className="confidence-row">
                  <span className="confidence-label">Confidence</span>
                  <span className="confidence-value">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="confidence-bar-track">
                  <div
                    className={`confidence-bar-fill ${isNormal ? "normal" : "abnormal"}`}
                    style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
            </div>

            <ConfidenceGauge confidence={result.confidence} isNormal={isNormal} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultCard;
