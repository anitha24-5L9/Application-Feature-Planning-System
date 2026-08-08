import { useEffect, useState } from "react";

import {
  getTargetUsers,
  addTargetUser,
  removeTargetUser,
  getTargetGroups,
  addTargetGroup,
  removeTargetGroup,
} from "../services/api";

import "../styles/targeting.css";

export default function TargetingPanel({ flagKey, activeTab }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const availableGroups = [
    "beta_users",
    "premium_plan",
    "internal_team",
    "qa_team",
  ];

  useEffect(() => {
    if (flagKey) {
      loadData();
    }
  }, [flagKey]);

  async function loadData() {
    try {
      const userData = await getTargetUsers(flagKey);
      setUsers(userData);

      const groupData = await getTargetGroups(flagKey);
      setGroups(groupData);
    } catch (error) {
      console.error("Targeting data loading failed:", error);
    }
  }

  async function handleAdd() {
    if (!userId.trim()) return;

    try {
      await addTargetUser(flagKey, userId.trim());

      setUserId("");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add user");
    }
  }

  async function handleDelete(id) {
    try {
      await removeTargetUser(flagKey, id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to remove user");
    }
  }

  async function handleAddGroup() {
    if (!selectedGroup) return;

    try {
      await addTargetGroup({
        flag_key: flagKey,
        group_name: selectedGroup,
      });

      setSelectedGroup("");
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add group");
    }
  }

  async function handleRemoveGroup(groupName) {
    try {
      await removeTargetGroup(flagKey, groupName);
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to remove group");
    }
  }

  return (
    <div className="target-panel">
      <div className="target-panel-header">
        <h3>Targeting Rules</h3>
        <p>
          Control which users or groups receive this feature flag.
        </p>
      </div>

      {activeTab === "whitelist" && (
        <div className="target-section">
          <div className="target-section-title">
            <div>
              <h4>User Whitelist</h4>
              <span>Add specific users to this feature flag.</span>
            </div>

            <span className="target-count">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>

          <div className="target-input">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
            />

            <button type="button" onClick={handleAdd}>
              Add User
            </button>
          </div>

          <div className="target-list">
            {users.length === 0 ? (
              <div className="empty">
                <span className="empty-icon">👤</span>
                <strong>No targeted users</strong>
                <p>Add a user ID above to create a whitelist rule.</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  className="target-item"
                  key={user.user_id}
                >
                  <div className="target-item-info">
                    <span className="user-icon">👤</span>
                    <span>{user.user_id}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "groups" && (
        <div className="target-section">
          <div className="target-section-title">
            <div>
              <h4>Group Targeting</h4>
              <span>Target this feature to selected user groups.</span>
            </div>

            <span className="target-count">
              {groups.length} {groups.length === 1 ? "group" : "groups"}
            </span>
          </div>

          <div className="group-controls">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select Group</option>

              {availableGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <button type="button" onClick={handleAddGroup}>
              Add Group
            </button>
          </div>

          <ul className="group-list">
            {groups.length === 0 ? (
              <li className="empty">
                <span className="empty-icon">👥</span>
                <strong>No targeted groups</strong>
                <p>Select a group above to create a targeting rule.</p>
              </li>
            ) : (
              groups.map((group) => (
                <li key={group.group_name}>
                  <div className="target-item-info">
                    <span className="group-icon">👥</span>
                    <span>{group.group_name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveGroup(group.group_name)
                    }
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}