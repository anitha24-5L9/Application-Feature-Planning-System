import { useEffect, useState } from "react";

import {
  getFlags,
  getEnvironments,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  getEnvironmentOverrides,
  saveEnvironmentOverride,
} from "../services/api";

import "../styles/environment.css";

function Environments() {
  const [flags, setFlags] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState("");

  const [environments, setEnvironments] = useState([]);
  const [overrides, setOverrides] = useState({});

  // Create Environment
  const [newEnvironment, setNewEnvironment] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit Environment
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  // Close popup with Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowCreateModal(false);
      }
    }

    if (showCreateModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCreateModal]);

  async function loadPage() {
    try {
      const flagData = await getFlags();
      const envData = await getEnvironments();

      setFlags(flagData);
      setEnvironments(envData);

      if (flagData.length > 0) {
        setSelectedFlag(flagData[0].key);
        await loadOverrides(flagData[0].key);
      }
    } catch (error) {
      console.error("Failed to load environment page:", error);
      alert("Failed to load environments.");
    }
  }

  async function loadOverrides(flagKey) {
    try {
      const data = await getEnvironmentOverrides(flagKey);

      const temp = {};

      data.forEach((item) => {
        temp[item.environment_name] = item.override_value;
      });

      setOverrides(temp);
    } catch (error) {
      console.error("Failed to load environment overrides:", error);
      setOverrides({});
    }
  }

  // Open Create Environment popup
  function openCreateModal() {
    setNewEnvironment("");
    setShowCreateModal(true);
  }

  // Close Create Environment popup
  function closeCreateModal() {
    if (creating) return;

    setNewEnvironment("");
    setShowCreateModal(false);
  }

  // Create Environment
  async function handleCreate() {
    const environmentName = newEnvironment.trim();

    if (!environmentName) {
      alert("Please enter an environment name.");
      return;
    }

    try {
      setCreating(true);

      await createEnvironment(environmentName);

      setNewEnvironment("");
      setShowCreateModal(false);

      await loadPage();

      alert(`Environment "${environmentName}" created successfully.`);
    } catch (err) {
      console.error("Environment creation failed:", err);
      alert(err.message || "Failed to create environment.");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id) {
    const updatedName = editingName.trim();

    if (!updatedName) {
      alert("Environment name cannot be empty.");
      return;
    }

    try {
      await updateEnvironment(id, updatedName);

      setEditingId(null);
      setEditingName("");

      await loadPage();
    } catch (err) {
      console.error("Environment update failed:", err);
      alert(err.message || "Failed to update environment.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this environment?")) {
      return;
    }

    try {
      await deleteEnvironment(id);

      await loadPage();
    } catch (err) {
      console.error("Environment deletion failed:", err);
      alert(err.message || "Failed to delete environment.");
    }
  }

  async function handleSaveOverride(environmentName) {
    try {
      await saveEnvironmentOverride({
        flag_key: selectedFlag,
        environment_name: environmentName,
        override_value: overrides[environmentName] ?? false,
      });

      alert("Override saved successfully.");
    } catch (err) {
      console.error("Override save failed:", err);
      alert(err.message || "Failed to save override.");
    }
  }

  return (
    <div className="environment-page">
      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="environment-header">
        <h1>Environment Management</h1>

        <p>
          Manage deployment environments and environment-specific
          feature overrides.
        </p>
      </div>

      {/* =========================
          FEATURE FLAG SELECTOR
      ========================== */}

      <div className="environment-card flag-selector-card">
        <label htmlFor="feature-flag">Feature Flag</label>

        <select
          id="feature-flag"
          value={selectedFlag}
          onChange={(e) => {
            const flagKey = e.target.value;

            setSelectedFlag(flagKey);
            loadOverrides(flagKey);
          }}
        >
          {flags.length === 0 ? (
            <option value="">No feature flags available</option>
          ) : (
            flags.map((flag) => (
              <option key={flag.key} value={flag.key}>
                {flag.key}
              </option>
            ))
          )}
        </select>
      </div>

      {/* =========================
          ENVIRONMENTS CARD
      ========================== */}

      <div className="environment-card environments-card">
        <div className="environments-card-header">
          <div>
            <h2>Environments</h2>

            <p className="environment-card-subtitle">
              Manage environments and feature flag overrides.
            </p>
          </div>

          {/* TOP RIGHT CREATE BUTTON */}
          <button
            type="button"
            className="create-environment-top-btn"
            onClick={openCreateModal}
          >
            <span className="create-plus">+</span>
            Create Environment
          </button>
        </div>

        {/* =========================
            ENVIRONMENT TABLE
        ========================== */}

        <div className="environment-table-wrapper">
          <table className="environment-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Override</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {environments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-environments">
                    <div className="empty-environments-content">
                      <div className="empty-environments-icon">🌍</div>

                      <h3>No environments found</h3>

                      <p>
                        Create your first environment using the
                        <strong> Create Environment </strong>
                        button above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                environments.map((env) => (
                  <tr key={env.id}>
                    {/* NAME */}
                    <td>
                      {editingId === env.id ? (
                        <input
                          className="environment-edit-input"
                          value={editingName}
                          onChange={(e) =>
                            setEditingName(e.target.value)
                          }
                          autoFocus
                        />
                      ) : (
                        <span className="environment-name">
                          {env.name}
                        </span>
                      )}
                    </td>

                    {/* OVERRIDE */}
                    <td>
                      <select
                        className="override-select"
                        value={
                          overrides[env.name] === undefined
                            ? ""
                            : overrides[env.name].toString()
                        }
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            [env.name]:
                              e.target.value === "true",
                          })
                        }
                      >
                        <option value="">Default</option>

                        <option value="true">True</option>

                        <option value="false">False</option>
                      </select>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="status-badge">
                        <span className="status-dot"></span>
                        Active
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="save-btn"
                          onClick={() =>
                            handleSaveOverride(env.name)
                          }
                        >
                          Save
                        </button>

                        {editingId === env.id ? (
                          <>
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                handleUpdate(env.id)
                              }
                            >
                              Update
                            </button>

                            <button
                              type="button"
                              className="cancel-edit-btn"
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => {
                              setEditingId(env.id);
                              setEditingName(env.name);
                            }}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(env.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          CREATE ENVIRONMENT MODAL
      ====================================================== */}

      {showCreateModal && (
        <div
          className="environment-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <div
            className="environment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-environment-title"
          >
            {/* Modal Header */}
            <div className="environment-modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">🌍</div>

                <div>
                  <h2 id="create-environment-title">
                    Create Environment
                  </h2>

                  <p>
                    Add a new deployment environment.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeCreateModal}
                disabled={creating}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="environment-modal-body">
              <div className="modal-selected-flag">
                <span className="selected-flag-label">
                  Feature Flag
                </span>

                <span className="selected-flag-value">
                  {selectedFlag || "No flag selected"}
                </span>
              </div>

              <label
                htmlFor="new-environment-name"
                className="modal-input-label"
              >
                Environment Name
              </label>

              <input
                id="new-environment-name"
                className="modal-environment-input"
                type="text"
                placeholder="e.g. staging"
                value={newEnvironment}
                onChange={(e) =>
                  setNewEnvironment(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) {
                    handleCreate();
                  }
                }}
                autoFocus
                disabled={creating}
              />

              <p className="modal-input-hint">
                Use a clear name such as development, staging,
                testing, or production.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="environment-modal-footer">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={closeCreateModal}
                disabled={creating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-create-btn"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Create Environment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Environments;