import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setContent("Please enter a topic to search.");
      return;
    }

    setLoading(true);
    setContent("");

    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          input.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Topic not found");
      }

      const data = await response.json();

      if (data.extract) {
        setContent(data.extract);
      } else {
        setContent("No useful information found for this topic.");
      }
    } catch (error) {
      setContent(
        "Sorry, no information was found. Try searching another topic."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.card}>
        <div style={styles.icon}>⌕</div>

        <h1 style={styles.heading}>Search Anything</h1>

        <p style={styles.subtitle}>
          Search a topic and get related information instantly.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Search a topic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Search →
          </button>
        </form>

        <div style={styles.resultBox}>
          <h2 style={styles.resultTitle}>Related Information</h2>

          {loading ? (
            <p style={styles.placeholder}>Searching for information...</p>
          ) : content ? (
            <p style={styles.resultText}>{content}</p>
          ) : (
            <p style={styles.placeholder}>
              Search any topic to see related information here.
            </p>
          )}
        </div>
      </div>

      <div style={styles.clock}>
        <div style={styles.clockIcon}>◷</div>

        <div>
          <div style={styles.clockTime}>
            {time.toLocaleTimeString()}
          </div>

          <div style={styles.clockDate}>
            {time.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "rgba(255, 255, 255, 0.97)",
    padding: "45px",
    borderRadius: "25px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    textAlign: "center",
  },

  icon: {
    fontSize: "55px",
    color: "#667eea",
    marginBottom: "10px",
  },

  heading: {
    fontSize: "36px",
    margin: "0 0 12px",
    color: "#222",
  },

  subtitle: {
    fontSize: "16px",
    color: "#777",
    marginBottom: "30px",
  },

  form: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
  },

  input: {
    flex: 1,
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    fontSize: "16px",
    outline: "none",
    minWidth: 0,
  },

  button: {
    padding: "16px 22px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultBox: {
    background: "#f5f6ff",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "left",
    minHeight: "130px",
    border: "1px solid #e5e7ff",
  },

  resultTitle: {
    margin: "0 0 15px",
    color: "#667eea",
    fontSize: "20px",
  },

  resultText: {
    fontSize: "18px",
    color: "#333",
    wordBreak: "break-word",
    lineHeight: "1.7",
  },

  placeholder: {
    color: "#999",
    fontStyle: "italic",
    lineHeight: "1.6",
  },

  clock: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    background: "rgba(255,255,255,0.95)",
    padding: "15px 20px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#333",
  },

  clockIcon: {
    fontSize: "30px",
    color: "#667eea",
  },

  clockTime: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#667eea",
  },

  clockDate: {
    fontSize: "12px",
    color: "#777",
    marginTop: "4px",
  },
};

export default App;