import { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".wav")) {
      setError("Please select a WAV file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a WAV file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h2>Valve Anomaly Detection</h2>

      <input
        type="file"
        accept=".wav"
        onChange={handleFileChange}
      />

      <br />
      <br />

      {file && (
        <p>
          Selected File: <strong>{file.name}</strong>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
          }}
        >
          {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Prediction Result</h3>

          <p>
            <strong>Status:</strong>{" "}
            {result.prediction === "normal"
              ? "🟢 Normal"
              : "🔴 Abnormal"}
          </p>

          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;