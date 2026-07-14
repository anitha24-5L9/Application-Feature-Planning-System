import { useEffect, useState } from "react";

import {
  getTargetUsers,
  addTargetUser,
  removeTargetUser,
} from "../services/api";

import "../styles/targeting.css";

export default function TargetingPanel({ flagKey }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadUsers();
  }, [flagKey]);

  async function loadUsers() {
    try {
      const data = await getTargetUsers(flagKey);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAdd() {
    if (!userId.trim()) return;

    await addTargetUser(flagKey, userId);

    setUserId("");

    loadUsers();
  }

  async function handleDelete(id) {
    await removeTargetUser(flagKey, id);

    loadUsers();
  }

  return (
    <div className="target-panel">

      <h3>Targeting Rules</h3>

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

    </div>
  );
}