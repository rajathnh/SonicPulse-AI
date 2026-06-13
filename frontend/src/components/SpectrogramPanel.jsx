import { BarChart2, ImageIcon, Loader } from "lucide-react";
import "./PlaceholderPanel.css";

function SpectrogramPanel({ spectrogram }) {
  if (!spectrogram) {
    return (
      <div className="card">
        <div className="card-header">
          <BarChart2 /> Spectrogram
        </div>
        <div className="card-body">
          <div className="placeholder-body">
            <ImageIcon />
            <div className="placeholder-title">Spectrogram Visualization</div>
            <div className="placeholder-text">
              Analyze an audio file to visualize the mel-frequency spectrogram
              here.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <BarChart2 /> Spectrogram
      </div>
      <div className="card-body">
        <div className="spectrogram-container">
          <img
            src={`data:image/png;base64,${spectrogram}`}
            alt="Mel-Frequency Spectrogram"
            className="spectrogram-image"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SpectrogramPanel;
