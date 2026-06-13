import { useState, useEffect } from "react";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import AudioPreview from "./components/AudioPreview";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultCard from "./components/ResultCard";
import SpectrogramPanel from "./components/SpectrogramPanel";
import ExplainabilityPanel from "./components/ExplainabilityPanel";
import HistoryPanel from "./components/HistoryPanel";

import "./App.css";

const API_URL = "http://127.0.0.1:8000/predict";

function App() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [spectrogram, setSpectrogram] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sonicpulse_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("sonicpulse_history", JSON.stringify(newHistory));
    } catch (e) {
      // ignore
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const handleFileRemove = () => {
    setFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setSpectrogram(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setSpectrogram(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data);

      // Extract and store spectrogram
      if (data.spectrogram) {
        setSpectrogram(data.spectrogram);
      }

      const newEntry = {
        filename: file.name,
        prediction: data.prediction,
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
      };

      saveHistory([newEntry, ...history].slice(0, 50));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-workspace">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="col-left">
            <UploadCard
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              disabled={loading}
              error={error}
            />
            {file && audioUrl && (
              <AudioPreview file={file} audioUrl={audioUrl} />
            )}
            <AnalyzeButton
              onClick={handleAnalyze}
              loading={loading}
              disabled={!file}
            />
            {/* History Panel can go at the bottom left */}
            <HistoryPanel history={history} onClear={handleClearHistory} />
          </div>

          {/* Right Column */}
          <div className="col-right">
            <ResultCard result={result} />
            <SpectrogramPanel spectrogram={spectrogram} />
            <ExplainabilityPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
