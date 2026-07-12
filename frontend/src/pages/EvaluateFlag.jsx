import { useEffect, useState } from "react";
import { getFlags } from "../services/api";
import "../styles/evaluate.css";

export default function EvaluateFlag() {
  const [flags, setFlags] = useState([]);
  const [flagKey, setFlagKey] = useState("");
  const [environment, setEnvironment] = useState("Development");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadFlags();
  }, []);

  async function loadFlags() {
    try {
      const data = await getFlags();
      setFlags(data);
    } catch (error) {
      console.error("Error loading flags:", error);
    }
  }

  function evaluateFlag() {
    if (!flagKey.trim()) {
      alert("Please enter a Flag Key");
      return;
    }

    const flag = flags.find(
      (f) => f.key.toLowerCase() === flagKey.trim().toLowerCase()
    );

    if (!flag) {
      setResult({
        status: "notfound",
        message: "⚠️ Feature Flag Not Found",
      });
      return;
    }

    if (flag.enabled) {
      setResult({
        status: "enabled",
        message: `🟢 Feature "${flag.key}" is ENABLED in ${environment}`,
      });
    } else {
      setResult({
        status: "disabled",
        message: `🔴 Feature "${flag.key}" is DISABLED in ${environment}`,
      });
    }
  }

  return (
    <div className="page-container">
      <h1>Evaluate Feature Flag</h1>

      <p>Check whether a feature flag is enabled.</p>

      <div className="evaluate-card">
        <h3>Flag Key</h3>

        <input
          type="text"
          placeholder="Enter flag key"
          value={flagKey}
          onChange={(e) => setFlagKey(e.target.value)}
        />

        <h3>Environment</h3>

        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
        >
          <option>Development</option>
          <option>Testing</option>
          <option>Production</option>
        </select>

        <button
          className="quick-btn"
          onClick={evaluateFlag}
        >
          Evaluate
        </button>

        {result && (
          <div className={`result-box ${result.status}`}>
            <h2>Result</h2>
            <p>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}