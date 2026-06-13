import { BarChart2, ImageIcon } from "lucide-react";
import "./PlaceholderPanel.css";

function SpectrogramPanel({ spectrogram }) {
  return (
    <div className="card">
      <div className="card-header">
        <BarChart2 />
        <span>Spectrogram</span>
      </div>

      <div className="card-body">
        {spectrogram ? (
          <img
            src={`http://127.0.0.1:8000/results/${spectrogram}`}
            alt="Spectrogram"
            className="spectrogram-image"
          />
        ) : (
          <div className="placeholder-body">
            <ImageIcon />

            <div className="placeholder-title">
              Spectrogram Visualization
            </div>

            <div className="placeholder-text">
              Upload and analyze a WAV file to generate a spectrogram.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpectrogramPanel;