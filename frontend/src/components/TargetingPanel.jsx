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

export default function TargetingPanel({ flagKey }) {
  // User Targeting State
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  // Group Targeting State
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  // Available Groups
  const availableGroups = [
    "beta_users",
    "premium_plan",
    "internal_team",
    "qa_team",
  ];

  useEffect(() => {
    loadData();
  }, [flagKey]);

  async function loadData() {
    try {
      const userData = await getTargetUsers(flagKey);
      setUsers(userData);

      const groupData = await getTargetGroups(flagKey);
      setGroups(groupData);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAdd() {
    if (!userId.trim()) return;

    await addTargetUser(flagKey, userId);

    setUserId("");

    loadData();
  }

  async function handleDelete(id) {
    await removeTargetUser(flagKey, id);

    loadData();
  }

  async function handleAddGroup() {
    if (!selectedGroup) return;

    await addTargetGroup({
      flag_key: flagKey,
      group_name: selectedGroup,
    });

    setSelectedGroup("");

    loadData();
  }

  async function handleRemoveGroup(groupName) {
    await removeTargetGroup(flagKey, groupName);

    loadData();
  }

  return (
    <div className="target-panel">

      <h3>Targeting Rules</h3>

      {/* User Targeting */}

      <div className="target-input">

        <input
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button onClick={handleAdd}>
          Add User
        </button>

      </div>

      <div className="target-list">

        {users.length === 0 ? (
          <p className="empty">
            No targeted users.
          </p>
        ) : (
          users.map((user) => (
            <div
              className="target-item"
              key={user.user_id}
            >
              <span>{user.user_id}</span>

              <button
                onClick={() => handleDelete(user.user_id)}
              >
                Remove
              </button>

            </div>
          ))
        )}

      </div>

      <hr />

      {/* Group Targeting */}
      <br></br>
      <br></br>

      <h3>Group Targeting</h3>

      <div className="group-controls">

        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >

          <option value="">
            Select Group
          </option>

          {availableGroups.map((group) => (
            <option
              key={group}
              value={group}
            >
              {group}
            </option>
          ))}

        </select>

        <button onClick={handleAddGroup}>
          Add Group
        </button>

      </div>

      <ul className="group-list">

        {groups.length === 0 ? (
          <p className="empty">
            No targeted groups.
          </p>
        ) : (
          groups.map((group) => (
            <li key={group.group_name}>

              <span>{group.group_name}</span>

              <button
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
  );
}