import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFlags } from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  async function loadFlags() {
    try {
      const data = await getFlags();
      setFlags(data);
    } catch (error) {
      console.error("Error loading flags:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalFlags = flags.length;

  const enabledFlags = flags.filter(
    (flag) => flag.enabled
  ).length;

  const disabledFlags = totalFlags - enabledFlags;

  const teams = new Set(
    flags
      .map((flag) => flag.owner_team)
      .filter(Boolean)
  ).size;

  const enabledPercentage =
    totalFlags > 0
      ? Math.round((enabledFlags / totalFlags) * 100)
      : 0;

  const disabledPercentage =
    totalFlags > 0
      ? Math.round((disabledFlags / totalFlags) * 100)
      : 0;

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of your feature flags and
            configuration activity.
          </p>
        </div>
      </div>


      {/* ================= STATISTICS ================= */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-info">
            <span>Total Flags</span>
            <strong>{totalFlags}</strong>
          </div>

          <div className="stat-icon blue">
            🚩
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <span>Enabled Flags</span>
            <strong>{enabledFlags}</strong>
          </div>

          <div className="stat-icon green">
            ✓
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <span>Disabled Flags</span>
            <strong>{disabledFlags}</strong>
          </div>

          <div className="stat-icon red">
            ✕
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <span>Owner Teams</span>
            <strong>{teams}</strong>
          </div>

          <div className="stat-icon purple">
            👥
          </div>
        </div>

      </div>


      {/* ================= FLAG STATUS ================= */}

      <div className="dashboard-card flag-status-card">

        <div className="dashboard-card-header">

          <div>
            <h2>Flag Status</h2>

            <p>
              Distribution of enabled and disabled
              feature flags.
            </p>
          </div>

          <span className="status-total">
            {totalFlags} Total
          </span>

        </div>


        {loading ? (

          <div className="dashboard-loading">
            Loading flag status...
          </div>

        ) : (

          <div className="status-bars">

            {/* Enabled */}

            <div className="status-row">

              <div className="status-label">
                <span>Enabled</span>
                <strong>{enabledFlags}</strong>
              </div>

              <div className="status-track">

                <div
                  className="status-fill enabled-fill"
                  style={{
                    width: `${enabledPercentage}%`,
                  }}
                />

              </div>

              <span className="status-percentage">
                {enabledPercentage}%
              </span>

            </div>


            {/* Disabled */}

            <div className="status-row">

              <div className="status-label">
                <span>Disabled</span>
                <strong>{disabledFlags}</strong>
              </div>

              <div className="status-track">

                <div
                  className="status-fill disabled-fill"
                  style={{
                    width: `${disabledPercentage}%`,
                  }}
                />

              </div>

              <span className="status-percentage">
                {disabledPercentage}%
              </span>

            </div>

          </div>

        )}

      </div>


      {/* ================= BOTTOM SECTION ================= */}

      <div className="dashboard-bottom-grid">


        {/* ================= RECENT ACTIVITY ================= */}

        <div className="dashboard-card recent-activity">

          <div className="dashboard-card-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Latest feature flag status.
              </p>
            </div>

          </div>


          <div className="activity-list">

            {loading ? (

              <div className="dashboard-loading">
                Loading activity...
              </div>

            ) : flags.length === 0 ? (

              <div className="activity-empty">
                No feature flags found.
              </div>

            ) : (

              flags.slice(0, 6).map((flag) => (

                <div
                  className="activity-item"
                  key={flag.key}
                >

                  <div className="activity-icon">
                    {flag.enabled ? "✓" : "✕"}
                  </div>

                  <div className="activity-content">

                    <strong>
                      {flag.key}
                    </strong>

                    <span>
                      {flag.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                  </div>

                  <span
                    className={
                      flag.enabled
                        ? "activity-status enabled"
                        : "activity-status disabled"
                    }
                  >
                    {flag.enabled
                      ? "Active"
                      : "Disabled"}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-card quick-actions">

          <div className="dashboard-card-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Quickly access common operations.
              </p>
            </div>

          </div>


          <div className="quick-actions-list">

            <button
              className="quick-action-btn"
              onClick={() =>
                navigate("/features?action=create")
              }
            >

              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-content">

                <strong>
                  Create Feature
                </strong>

                <small>
                  Create a new feature flag
                </small>

              </span>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action-btn"
              onClick={() =>
                navigate("/evaluate")
              }
            >

              <span className="quick-action-icon">
                ⚡
              </span>

              <span className="quick-action-content">

                <strong>
                  Evaluate Flag
                </strong>

                <small>
                  Test flag evaluation
                </small>

              </span>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action-btn"
              onClick={() =>
                navigate("/audit-logs")
              }
            >

              <span className="quick-action-icon">
                ☷
              </span>

              <span className="quick-action-content">

                <strong>
                  Audit Logs
                </strong>

                <small>
                  View system activity
                </small>

              </span>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action-btn"
              onClick={() =>
                navigate("/environments")
              }
            >

              <span className="quick-action-icon">
                🌍
              </span>

              <span className="quick-action-content">

                <strong>
                  Environments
                </strong>

                <small>
                  Manage environments
                </small>

              </span>

              <span className="quick-arrow">
                →
              </span>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}