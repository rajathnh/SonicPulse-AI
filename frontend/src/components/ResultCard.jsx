function ResultCard({ result }) {
  if (!result) return null;

  const isNormal = result.prediction === "normal";

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
      }}
    >
      <h2>Analysis Result</h2>

      <div
        style={{
          fontSize: "1.2rem",
          marginBottom: "12px",
          fontWeight: "bold",
        }}
      >
        Status:{" "}
        {isNormal ? (
          <span style={{ color: "green" }}>
            🟢 Normal
          </span>
        ) : (
          <span style={{ color: "red" }}>
            🔴 Abnormal
          </span>
        )}
      </div>

      <p>
        <strong>Confidence:</strong>{" "}
        {(result.confidence * 100).toFixed(2)}%
      </p>

      {result.normal_probability !== undefined && (
        <p>
          <strong>Normal Probability:</strong>{" "}
          {(result.normal_probability * 100).toFixed(2)}%
        </p>
      )}

      {result.abnormal_probability !== undefined && (
        <p>
          <strong>Abnormal Probability:</strong>{" "}
          {(result.abnormal_probability * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export default ResultCard;