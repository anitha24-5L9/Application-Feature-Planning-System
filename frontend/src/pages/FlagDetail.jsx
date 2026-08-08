import "./../styles/flagDetail.css";
import "./../styles/rollout.css";

import TargetingPanel from "../components/TargetingPanel";
import EvaluationChart from "../components/EvaluationChart";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getFlag,
  getRolloutPercentage,
  updateRolloutPercentage,
  evaluateFlag,
  syncAnalytics,
} from "../services/api";

function FlagDetail() {
  const { key } = useParams();

  const [flag, setFlag] = useState(null);
  const [rollout, setRollout] = useState(0);
  const [environment, setEnvironment] =
    useState("development");

  const [userId, setUserId] = useState("");
  const [evaluationResult, setEvaluationResult] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] =
    useState("whitelist");

  const [chartRefresh, setChartRefresh] =
    useState(false);

  useEffect(() => {
    loadFlag();
  }, [key]);

  async function loadFlag() {
    try {
      const data = await getFlag(key);

      setFlag(data);

      const rolloutData =
        await getRolloutPercentage(key);

      setRollout(
        rolloutData.rollout_percentage
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function saveRollout() {
    try {
      await updateRolloutPercentage(
        key,
        rollout
      );

      alert(
        "Rollout updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update rollout."
      );
    }
  }

  async function evaluateFeature() {
    if (!flag) return;

    try {
      setLoading(true);

      const result = await evaluateFlag({
        flag_key: flag.key,
        environment: environment,
        user_context: {
          user_id: userId,
        },
      });

      setEvaluationResult(result);

      await syncAnalytics();

      setChartRefresh(
        (prev) => !prev
      );
    } catch (error) {
      console.error(error);

      alert("Evaluation failed");
    } finally {
      setLoading(false);
    }
  }

  if (!flag) {
    return (
      <div className="flag-detail-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="flag-detail-page">

      <Link
        className="back-link"
        to="/features"
      >
        ← Back to Features
      </Link>

      <h1 className="page-title">
        Flag Details
      </h1>

      <div className="detail-card">

        <h2>Feature Information</h2>

        <table className="detail-table">

          <tbody>

            <tr>
              <td className="label">
                Feature Key
              </td>

              <td className="value">
                {flag.key}
              </td>
            </tr>

            <tr>
              <td className="label">
                Type
              </td>

              <td className="value">
                {flag.type}
              </td>
            </tr>

            <tr>
              <td className="label">
                Default Value
              </td>

              <td className="value">
                {String(flag.enabled)}
              </td>
            </tr>

            <tr>
              <td className="label">
                Status
              </td>

              <td>
                <span
                  className={
                    flag.enabled
                      ? "status-badge enabled"
                      : "status-badge disabled"
                  }
                >
                  {flag.enabled
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </td>
            </tr>

            <tr>
              <td className="label">
                Description
              </td>

              <td className="value">
                {flag.description ||
                  "No description"}
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <h2 className="section-title">
        Targeting Rules
      </h2>

      <div className="detail-tabs">

        <button
          type="button"
          className={
            activeTab === "whitelist"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("whitelist")
          }
        >
          👤 Whitelist
        </button>

        <button
          type="button"
          className={
            activeTab === "groups"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("groups")
          }
        >
          👥 Group Targeting
        </button>

        <button
          type="button"
          className={
            activeTab === "rollout"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("rollout")
          }
        >
          🎯 Rollout
        </button>

        <button
          type="button"
          className={
            activeTab === "test"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("test")
          }
        >
          ⚡ Test Panel
        </button>

      </div>

      {(activeTab === "whitelist" ||
        activeTab === "groups") && (
        <TargetingPanel
          flagKey={flag.key}
          activeTab={activeTab}
        />
      )}

      {activeTab === "rollout" && (
        <div className="rollout-panel">

          <div className="rollout-header">
            <h3>Rollout Percentage</h3>

            <span className="rollout-value">
              {rollout}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={rollout}
            onChange={(e) =>
              setRollout(
                Number(e.target.value)
              )
            }
            className="rollout-slider"
          />

          <button
            className="rollout-button"
            onClick={saveRollout}
          >
            Save Rollout
          </button>

        </div>
      )}

      {activeTab === "test" && (
        <div className="evaluation-panel">

          <h3>Test Feature Flag</h3>

          <select
            className="evaluation-select"
            value={environment}
            onChange={(e) =>
              setEnvironment(
                e.target.value
              )
            }
          >
            <option value="development">
              Development
            </option>

            <option value="staging">
              Staging
            </option>

            <option value="production">
              Production
            </option>
          </select>

          <input
            className="evaluation-input"
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value)
            }
          />

          <button
            className="evaluation-button"
            onClick={evaluateFeature}
            disabled={loading}
          >
            {loading
              ? "Evaluating..."
              : "Evaluate"}
          </button>

          {evaluationResult && (
            <div className="evaluation-result">

              <h3>
                Evaluation Result
              </h3>

              <p className="result-item">
                <strong>
                  Enabled:
                </strong>{" "}

                <span
                  className={
                    evaluationResult.enabled
                      ? "result-enabled"
                      : "result-disabled"
                  }
                >
                  {String(
                    evaluationResult.enabled
                  )}
                </span>
              </p>

              <p className="result-item">
                <strong>
                  Reason:
                </strong>{" "}
                {evaluationResult.reason}
              </p>

              <p className="result-item">

                <strong>
                  Source:
                </strong>{" "}

                <span
                  className={
                    evaluationResult.source ===
                    "cache"
                      ? "cache-badge"
                      : "live-badge"
                  }
                >
                  {evaluationResult.source}
                </span>

              </p>

            </div>
          )}

        </div>
      )}

      <EvaluationChart
        flagKey={flag.key}
        refresh={chartRefresh}
      />

    </div>
  );
}

export default FlagDetail;