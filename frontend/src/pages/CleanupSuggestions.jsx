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
    <div className="cleanup-page">

      <div className="cleanup-page-header">

        <div>
          <h1>Cleanup Suggestions</h1>

          <p>
            Review stale feature flags and clean up
            unused configurations.
          </p>
        </div>

        {!loading && flags.length > 0 && (
          <span className="cleanup-count">
            {flags.length} suggestion
            {flags.length !== 1 ? "s" : ""}
          </span>
        )}

      </div>


      {loading ? (

        <div className="cleanup-empty">

          <div className="cleanup-loading">
            Loading suggestions...
          </div>

        </div>

      ) : flags.length === 0 ? (

        <div className="cleanup-empty">

          <div className="cleanup-empty-icon">
            🎉
          </div>

          <h3>
            No cleanup suggestions
          </h3>

          <p>
            Your feature flags are looking clean.
          </p>

        </div>

      ) : (

        <div className="cleanup-list">

          {flags.map((flag) => (

            <div
              className={`cleanup-card ${
                flag.reviewed ? "reviewed" : ""
              }`}
              key={flag.key}
            >

              <div className="cleanup-info">

                <div className="cleanup-title-row">

                  <h3>
                    {flag.key}
                  </h3>

                  {flag.reviewed && (
                    <span className="reviewed-badge">
                      ✓ Reviewed
                    </span>
                  )}

                </div>


                <div className="cleanup-details">

                  <p>
                    <strong>
                      Owner
                    </strong>

                    <span>
                      {flag.owner_team || "Unknown"}
                    </span>
                  </p>


                  <p>
                    <strong>
                      Status
                    </strong>

                    <span>
                      {flag.enabled
                        ? `${flag.rollout_percentage}% Rollout`
                        : "Disabled"}
                    </span>
                  </p>


                  <p>
                    <strong>
                      Stale
                    </strong>

                    <span className="stale-value">
                      {flag.days_stale} days
                    </span>
                  </p>

                </div>

              </div>


              {!flag.reviewed && (

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

          ))}

        </div>

      )}

    </div>
  );
}