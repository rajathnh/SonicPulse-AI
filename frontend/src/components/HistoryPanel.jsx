import { History, Clock, Trash2 } from "lucide-react";
import "./HistoryPanel.css";

function HistoryPanel({ history, onClear }) {
  const fmtTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  return (
    <div className="card">
      <div className="history-header-row">
        <div className="history-header-left">
          <History /> Recent Analyses
        </div>
        {history.length > 0 && (
          <button className="history-clear" onClick={onClear} type="button">
            <Trash2 /> Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="history-empty">
          <Clock />
          <p>No analyses yet</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={item.timestamp + i}>
                  <td><span className="history-fname">{item.filename}</span></td>
                  <td>
                    <span className="history-status">
                      <span className={`history-dot ${item.prediction}`} />
                      <span className={`history-pred ${item.prediction}`}>{item.prediction}</span>
                    </span>
                  </td>
                  <td><span className="history-conf">{(item.confidence * 100).toFixed(1)}%</span></td>
                  <td><span className="history-time">{fmtTime(item.timestamp)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
