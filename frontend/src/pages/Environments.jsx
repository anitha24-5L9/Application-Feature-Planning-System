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

  const [newEnvironment, setNewEnvironment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    const flagData = await getFlags();
    const envData = await getEnvironments();

    setFlags(flagData);
    setEnvironments(envData);

    if (flagData.length > 0) {
      setSelectedFlag(flagData[0].key);
      loadOverrides(flagData[0].key);
    }
  }

  async function loadOverrides(flagKey) {
    const data = await getEnvironmentOverrides(flagKey);

    const temp = {};

    data.forEach((item) => {
      temp[item.environment_name] = item.override_value;
    });

    setOverrides(temp);
  }

  async function handleCreate() {
    if (!newEnvironment.trim()) return;

    try {
      await createEnvironment(newEnvironment);

      setNewEnvironment("");

      loadPage();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdate(id) {
    try {
      await updateEnvironment(id, editingName);

      setEditingId(null);

      loadPage();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this environment?")) return;

    await deleteEnvironment(id);

    loadPage();
  }

  async function handleSaveOverride(environmentName) {
    await saveEnvironmentOverride({
      flag_key: selectedFlag,
      environment_name: environmentName,
      override_value: overrides[environmentName] ?? false,
    });

    alert("Override Saved");
  }

  return (
    <div className="environment-page">

      <div className="environment-header">
        <h1>Environment Management</h1>
        <p>
          Manage deployment environments and
          environment-specific feature overrides.
        </p>
      </div>

      <div className="environment-card">

        <label>Feature Flag</label>

        <select
          value={selectedFlag}
          onChange={(e) => {
            setSelectedFlag(e.target.value);
            loadOverrides(e.target.value);
          }}
        >
          {flags.map((flag) => (
            <option key={flag.key}>
              {flag.key}
            </option>
          ))}
        </select>

      </div>

      <div className="environment-card">

        <h2>Environments</h2>

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

            {environments.map((env) => (

              <tr key={env.id}>

                <td>

                  {editingId === env.id ? (

                    <input
                      value={editingName}
                      onChange={(e) =>
                        setEditingName(e.target.value)
                      }
                    />

                  ) : (

                    env.name

                  )}

                </td>

                <td>

                  <select
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

                    <option value="">
                      Default
                    </option>

                    <option value="true">
                      True
                    </option>

                    <option value="false">
                      False
                    </option>

                  </select>

                </td>

                <td>

                  <span className="status-badge">
                    Active
                  </span>

                </td>

                <td>

                  <button
                    className="save-btn"
                    onClick={() =>
                      handleSaveOverride(env.name)
                    }
                  >
                    Save
                  </button>

                  {editingId === env.id ? (

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleUpdate(env.id)
                      }
                    >
                      Update
                    </button>

                  ) : (

                    <button
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
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(env.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="environment-card">

        <h2>Add Environment</h2>

        <div className="create-box">

          <input
            placeholder="Environment name..."
            value={newEnvironment}
            onChange={(e) =>
              setNewEnvironment(e.target.value)
            }
          />

          <button
            className="create-btn"
            onClick={handleCreate}
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}

export default Environments;