import { Link } from "react-router-dom";

function FlagTable({
  flags,
  onEdit,
  onDelete,
}) {
  return (
    <table className="flag-table">
      <thead>
        <tr>
          <th>
            Feature
          </th>

          <th>
            Type
          </th>

          <th>
            Status
          </th>

          <th>
            Owner Team
          </th>

          <th className="actions-header">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {flags.length > 0 ? (
          flags.map((flag) => (
            <tr key={flag.id}>

              {/* =========================
                  FEATURE
              ========================== */}
              <td>
                <Link to={`/flags/${flag.key}`}>
                  <strong>
                    {flag.key}
                  </strong>
                </Link>
              </td>


              {/* =========================
                  TYPE
              ========================== */}
              <td>
                <span className="type-badge">
                  {flag.type}
                </span>
              </td>


              {/* =========================
                  STATUS
              ========================== */}
              <td>
                {flag.enabled ? (
                  <span className="status enabled">
                    Enabled
                  </span>
                ) : (
                  <span className="status disabled">
                    Disabled
                  </span>
                )}
              </td>


              {/* =========================
                  OWNER TEAM
              ========================== */}
              <td>
                {flag.owner_team}
              </td>


              {/* =========================
                  ACTIONS
              ========================== */}
              <td className="actions-cell">
                <div className="action-buttons">

                  {/* Edit */}
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => onEdit(flag)}
                  >
                    ✏ Edit
                  </button>


                  {/* Delete */}
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(flag)}
                  >
                    🗑 Delete
                  </button>

                </div>
              </td>

            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              className="empty-state"
            >
              No Feature Flags Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default FlagTable;