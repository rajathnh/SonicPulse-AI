import { Zap } from "lucide-react";
import "./AnalyzeButton.css";

function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <div className="card analyze-card">
      <div className="card-header">
        <Zap /> Analysis
      </div>
      <div className="card-body">
        <button
          className="analyze-btn"
          onClick={onClick}
          disabled={disabled || loading}
          id="analyze-button"
          type="button"
        >
          {loading ? (
            <><span className="analyze-spinner" /> Analyzing...</>
          ) : (
            <><Zap size={16} /> Analyze Audio</>
          )}
        </button>
      </div>
    </div>
  );
}

export default AnalyzeButton;
