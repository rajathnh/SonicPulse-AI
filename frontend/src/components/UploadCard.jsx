import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import "./UploadCard.css";

function UploadCard({ file, onFileSelect, onFileRemove, disabled, error }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onFileSelect(accepted[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/wav": [".wav"] },
    multiple: false,
    disabled,
  });

  const fmtSize = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="card">
      <div className="card-header">
        <Upload /> Upload Audio
      </div>
      <div className="card-body">
        <div
          {...getRootProps()}
          className={`dropzone${isDragActive ? " active" : ""}${disabled ? " disabled" : ""}`}
        >
          <input {...getInputProps()} id="audio-upload-input" />
          <div className="dropzone-icon"><Upload /></div>
          <div className="dropzone-text">
            {isDragActive ? "Drop file here" : "Drag & drop or click to browse"}
          </div>
          <div className="dropzone-hint">Valve recording for anomaly analysis</div>
          <span className="dropzone-format"><FileAudio size={12} /> .wav</span>
        </div>

        {file && (
          <div className="file-row">
            <div className="file-icon"><FileAudio /></div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">{fmtSize(file.size)}</div>
            </div>
            <button className="file-remove" onClick={onFileRemove} type="button" aria-label="Remove file">
              <X />
            </button>
          </div>
        )}

        {error && (
          <div className="upload-error">
            <AlertCircle /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCard;
