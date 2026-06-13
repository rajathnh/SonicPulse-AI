import { useState, useRef, useEffect } from "react";
import { Music, Clock, HardDrive, Headphones } from "lucide-react";
import "./AudioPreview.css";

function AudioPreview({ file, audioUrl }) {
  const [duration, setDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => { setDuration(null); }, [file]);

  const fmtDuration = (s) => {
    if (!s || !isFinite(s)) return "--:--";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const fmtSize = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="card">
      <div className="card-header">
        <Headphones /> Audio Preview
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="audio-preview">
          <div className="audio-thumb"><Music /></div>
          <div className="audio-info">
            <div className="audio-filename">{file.name}</div>
            <div className="audio-meta-row">
              <span className="audio-meta-item"><Clock /> {fmtDuration(duration)}</span>
              <span className="audio-meta-item"><HardDrive /> {fmtSize(file.size)}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 12px 12px" }}>
          <audio
            ref={audioRef}
            className="audio-player"
            controls
            src={audioUrl}
            onLoadedMetadata={() => {
              if (audioRef.current) setDuration(audioRef.current.duration);
            }}
            id="audio-player"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPreview;
