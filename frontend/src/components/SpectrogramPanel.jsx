import { BarChart2, ImageIcon } from "lucide-react";
import "./PlaceholderPanel.css";

function SpectrogramPanel() {
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
            Ready for backend integration. Connect a spectrogram endpoint to display the mel-frequency spectrogram here.
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpectrogramPanel;
