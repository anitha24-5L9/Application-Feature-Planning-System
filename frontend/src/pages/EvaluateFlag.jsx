import { useEffect, useState } from "react";

import {
  getFlags,
  evaluateFlag as evaluateFlagApi,
} from "../services/api";

import {
  useEnvironment,
} from "../context/EnvironmentContext";

import "../styles/evaluate.css";

export default function EvaluateFlag() {
  // ==========================================
  // State
  // ==========================================

  const [flags, setFlags] = useState([]);
  const [flagKey, setFlagKey] = useState("");
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Environment Context
  // ==========================================

  const {
    environment,
    setEnvironment,
    environments = [
      "development",
      "testing",
      "staging",
    ],
  } = useEnvironment();

  // ==========================================
  // Load Flags
  // ==========================================

  useEffect(() => {
    loadFlags();
  }, []);

  async function loadFlags() {
    try {
      const data = await getFlags();

      setFlags(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error loading flags:",
        error
      );

      setFlags([]);
    }
  }

  // ==========================================
  // Evaluate Feature Flag
  // ==========================================

  async function evaluateFeatureFlag() {
    const trimmedKey = flagKey.trim();
    const trimmedUserId = userId.trim();

    if (!trimmedKey) {
      alert("Please enter a Flag Key");
      return;
    }

    if (!trimmedUserId) {
      alert("Please enter a User ID");
      return;
    }

    if (!environment) {
      alert("Please select an Environment");
      return;
    }

    // Find requested flag
    const flag = flags.find(
      (item) =>
        item.key?.toLowerCase() ===
        trimmedKey.toLowerCase()
    );

    if (!flag) {
      setResult({
        status: "notfound",
        message:
          "⚠️ Feature Flag Not Found",
      });

      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response =
        await evaluateFlagApi({
          flag_key: flag.key,
          environment: environment,

          user_context: {
            user_id: trimmedUserId,
          },
        });

      if (!response.success) {
        setResult({
          status: "notfound",
          message:
            response.message ||
            "Evaluation failed",
        });

        return;
      }

      setResult({
        status: response.enabled
          ? "enabled"
          : "disabled",

        message: response.enabled
          ? `🟢 Feature "${flag.key}" is ENABLED in ${environment}`
          : `🔴 Feature "${flag.key}" is DISABLED in ${environment}`,

        reason: response.reason,
        source: response.source,
      });
    } catch (error) {
      console.error(
        "Feature evaluation failed:",
        error
      );

      setResult({
        status: "notfound",
        message:
          "⚠️ Failed to evaluate feature flag",
      });
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Environment Change
  // ==========================================

  function handleEnvironmentChange(event) {
    const selectedEnvironment =
      event.target.value;

    setEnvironment(
      selectedEnvironment
    );

    // Clear old evaluation result
    setResult(null);
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="evaluate-page">

      {/* ==================================
          PAGE HEADER
      ================================== */}

      <h1>
        Evaluate Feature Flag
      </h1>

      <p>
        Check whether a feature flag is
        enabled in the selected environment.
      </p>


      {/* ==================================
          EVALUATION CARD
      ================================== */}

      <div className="evaluate-card">

        {/* ==================================
            FLAG KEY
        ================================== */}

        <h3>
          Flag Key
        </h3>

        <input
          type="text"
          placeholder="Enter flag key"
          value={flagKey}
          onChange={(event) => {
            setFlagKey(
              event.target.value
            );
            setResult(null);
          }}
        />


        {/* ==================================
            ENVIRONMENT
        ================================== */}

        <h3>
          Environment
        </h3>

        <select
          value={environment || ""}
          onChange={
            handleEnvironmentChange
          }
          aria-label="Select environment"
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


        {/* ==================================
            USER ID
        ================================== */}

        <h3>
          User ID
        </h3>

        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(event) => {
            setUserId(
              event.target.value
            );
            setResult(null);
          }}
        />


        {/* ==================================
            SELECTED ENVIRONMENT INFO
        ================================== */}

        <p className="selected-environment">
          🌍 Current Environment:{" "}
          <strong>
            {environment}
          </strong>
        </p>


        {/* ==================================
            EVALUATE BUTTON
        ================================== */}

        <button
          className="quick-btn"
          onClick={
            evaluateFeatureFlag
          }
          disabled={loading}
        >
          {loading
            ? "Evaluating..."
            : "Evaluate"}
        </button>


        {/* ==================================
            RESULT
        ================================== */}

        {result && (
          <div
            className={`result-box ${result.status}`}
          >

            <h2>
              Result
            </h2>

            <p>
              {result.message}
            </p>

            {result.reason && (
              <p>
                <strong>
                  Reason:
                </strong>{" "}
                {result.reason}
              </p>
            )}

            {result.source && (
              <p>
                <strong>
                  Source:
                </strong>{" "}
                {result.source}
              </p>
            )}

          </div>
        )}

      </div>

    </div>
  );
}