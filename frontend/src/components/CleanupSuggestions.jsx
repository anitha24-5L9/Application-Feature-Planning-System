import { useEffect, useState } from "react";

import {
  getCleanupSuggestions,
  markCleanupReviewed,
} from "../services/api";

import "../styles/cleanupSuggestions.css";

export default function CleanupSuggestions() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      const data = await getCleanupSuggestions();
      setFlags(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function reviewFlag(flagKey) {
    try {
      await markCleanupReviewed(flagKey);

      setFlags((prev) =>
        prev.map((flag) =>
          flag.key === flagKey
            ? { ...flag, reviewed: true }
            : flag
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="panel cleanup-panel">

      <h2>🧹 Cleanup Suggestions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : flags.length === 0 ? (
        <p>No cleanup suggestions 🎉</p>
      ) : (
        flags.map((flag) => (
          <div
            className="cleanup-card"
            key={flag.key}
          >
            <div className="cleanup-info">

              <h3>{flag.key}</h3>

              <p>
                <strong>Owner:</strong>{" "}
                {flag.owner_team}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {flag.enabled
                  ? `${flag.rollout_percentage}% Rollout`
                  : "Disabled"}
              </p>

              <p>
                <strong>Stale:</strong>{" "}
                {flag.days_stale} days
              </p>

            </div>

            {flag.reviewed ? (
              <span className="reviewed-badge">
                ✅ Reviewed
              </span>
            ) : (
              <button
                className="review-btn"
                onClick={() =>
                  reviewFlag(flag.key)
                }
              >
                Mark Reviewed
              </button>
            )}

          </div>
        ))
      )}

    </div>
  );
}