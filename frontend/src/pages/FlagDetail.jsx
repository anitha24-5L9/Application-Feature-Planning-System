import "./../styles/flagDetail.css";
import "./../styles/rollout.css";

import TargetingPanel from "../components/TargetingPanel";
import EvaluationChart from "../components/EvaluationChart";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useEnvironment,
} from "../context/EnvironmentContext";

import {
  getFlag,
  getRolloutPercentage,
  updateRolloutPercentage,
  evaluateFlag,
  syncAnalytics,
} from "../services/api";

function FlagDetail() {
  const { key } = useParams();

  // ==========================================
  // Environment Context
  // ==========================================

  const {
    environment,
    setEnvironment,
    environments,
  } = useEnvironment();

  // ==========================================
  // State
  // ==========================================

  const [flag, setFlag] =
    useState(null);

  const [rollout, setRollout] =
    useState(0);

  const [userId, setUserId] =
    useState("");

  const [evaluationResult, setEvaluationResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("whitelist");

  const [chartRefresh, setChartRefresh] =
    useState(false);

  // ==========================================
  // Load Flag
  // ==========================================

  useEffect(() => {
    loadFlag();
  }, [key]);

  async function loadFlag() {
    try {
      const data =
        await getFlag(key);

      setFlag(data);

      const rolloutData =
        await getRolloutPercentage(key);

      setRollout(
        Number(
          rolloutData?.rollout_percentage || 0
        )
      );
    } catch (error) {
      console.error(
        "Failed to load flag details:",
        error
      );
    }
  }

  // ==========================================
  // Save Rollout
  // ==========================================

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
      console.error(
        "Failed to update rollout:",
        error
      );

      alert(
        "Failed to update rollout."
      );
    }
  }

  // ==========================================
  // Environment Change
  // ==========================================

  function handleEnvironmentChange(
    event
  ) {
    const selectedEnvironment =
      event.target.value;

    setEnvironment(
      selectedEnvironment
    );

    // Clear previous evaluation
    setEvaluationResult(null);
  }

  // ==========================================
  // Evaluate Feature
  // ==========================================

  async function evaluateFeature() {
    if (!flag) {
      return;
    }

    if (!environment) {
      alert(
        "Please select an environment."
      );

      return;
    }

    if (!userId.trim()) {
      alert(
        "Please enter a User ID."
      );

      return;
    }

    try {
      setLoading(true);

      setEvaluationResult(null);

      const result =
        await evaluateFlag({
          flag_key: flag.key,

          environment:
            environment,

          user_context: {
            user_id:
              userId.trim(),
          },
        });

      setEvaluationResult(
        result
      );

      try {
        await syncAnalytics();
      } catch (analyticsError) {
        console.error(
          "Analytics sync failed:",
          analyticsError
        );
      }

      setChartRefresh(
        (previous) =>
          !previous
      );
    } catch (error) {
      console.error(
        "Feature evaluation failed:",
        error
      );

      alert(
        "Evaluation failed"
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Loading State
  // ==========================================

  if (!flag) {
    return (
      <div className="flag-detail-loading">
        Loading...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flag-detail-page">

      {/* ======================================
          BACK LINK
      ====================================== */}

      <Link
        className="back-link"
        to="/features"
      >
        ← Back to Features
      </Link>


      {/* ======================================
          PAGE TITLE
      ====================================== */}

      <h1 className="page-title">
        Flag Details
      </h1>


      {/* ======================================
          FEATURE INFORMATION
      ====================================== */}

      <div className="detail-card">

        <h2>
          Feature Information
        </h2>

        <div className="detail-table-wrapper">

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
                  {String(
                    flag.default_value ??
                    flag.enabled
                  )}
                </td>
              </tr>


              <tr>
                <td className="label">
                  Status
                </td>

                <td className="value">

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

      </div>


      {/* ======================================
          TARGETING RULES
      ====================================== */}

      <h2 className="section-title">
        Targeting Rules
      </h2>


      {/* ======================================
          TABS
      ====================================== */}

      <div className="detail-tabs">

        <button
          type="button"
          className={
            activeTab === "whitelist"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab(
              "whitelist"
            )
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
            setActiveTab(
              "groups"
            )
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
            setActiveTab(
              "rollout"
            )
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
            setActiveTab(
              "test"
            )
          }
        >
          ⚡ Test Panel
        </button>

      </div>


      {/* ======================================
          WHITELIST / GROUP TARGETING
      ====================================== */}

      {(
        activeTab === "whitelist" ||
        activeTab === "groups"
      ) && (

        <TargetingPanel
          flagKey={flag.key}
          activeTab={activeTab}
        />

      )}


      {/* ======================================
          ROLLOUT
      ====================================== */}

      {activeTab === "rollout" && (

        <div className="rollout-panel">

          <div className="rollout-header">
            <br></br>

            <h3>
              Rollout Percentage
            </h3><br></br>

            <span className="rollout-value">
              {rollout}%
            </span>

          </div>


          <input
            type="range"
            min="0"
            max="100"
            value={rollout}
            onChange={(event) =>
              setRollout(
                Number(
                  event.target.value
                )
              )
            }
            className="rollout-slider"
          />


          <center><button
            className="rollout-button"
            onClick={saveRollout}
          >
            Save Rollout
          </button></center>

        </div>

      )}


      {/* ======================================
          TEST PANEL
      ====================================== */}

      {activeTab === "test" && (

        <div className="evaluation-panel">
          <br></br><br></br>

          <h3>
            Test Feature Flag
          </h3><br></br>


          {/* ================================
              ENVIRONMENT
          ================================= */}

          <div className="evaluation-field">

            <label
              htmlFor="flag-environment"
            >
              🌍 Environment
            </label>


            <select
              id="flag-environment"
              className="evaluation-select"
              value={
                environment || ""
              }
              onChange={
                handleEnvironmentChange
              }
            >

              {environments.map(
                (env, index) => (

                  <option
                    key={`${env}-${index}`}
                    value={env}
                  >
                    {env}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ================================
              USER ID
          ================================= */}

          <div className="evaluation-field">

            <label
              htmlFor="flag-user-id"
            >
              User ID
            </label>


            <input
              id="flag-user-id"
              className="evaluation-input"
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(event) => {
                setUserId(
                  event.target.value
                );

                setEvaluationResult(
                  null
                );
              }}
            />

          </div>


          {/* ================================
              EVALUATE BUTTON
          ================================= */}

          <button
            className="evaluation-button"
            onClick={
              evaluateFeature
            }
            disabled={loading}
          >
            {loading
              ? "Evaluating..."
              : "Evaluate"}
          </button>


          {/* ================================
              RESULT
          ================================= */}

          {evaluationResult && (

            <div className="evaluation-result">

              <h3>
                Evaluation Result
              </h3>


              <p className="result-item">

                <strong>
                  Environment:
                </strong>{" "}

                <span>
                  {environment}
                </span>

              </p>


              <p className="result-item">

                <strong>
                  User ID:
                </strong>{" "}

                <span>
                  {userId}
                </span>

              </p>


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


              {evaluationResult.reason && (

                <p className="result-item">

                  <strong>
                    Reason:
                  </strong>{" "}

                  {evaluationResult.reason}

                </p>

              )}


              {evaluationResult.source && (

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
                    {
                      evaluationResult.source
                    }
                  </span>

                </p>

              )}

            </div>

          )}

        </div>

      )}


      {/* ======================================
          EVALUATION CHART
      ====================================== */}

      <EvaluationChart
        flagKey={flag.key}
        refresh={chartRefresh}
      />

    </div>
  );
}

export default FlagDetail;