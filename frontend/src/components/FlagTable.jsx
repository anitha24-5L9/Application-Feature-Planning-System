import { Link } from "react-router-dom";
function FlagTable({
  flags,
  onEdit
}) {
  return (
    <table className="flag-table">

      <thead>

        <tr>

          <th>Feature</th>

          <th>Type</th>

          <th>Status</th>

          <th>Owner Team</th>
          <th>Actions</th>

        </tr>

      </thead>

      <tbody>

        {flags.length > 0 ? (

          flags.map((flag) => (

            <tr key={flag.id}>

             <td>

  <Link to={`/flags/${flag.key}`}>

    <strong>{flag.key}</strong>

  </Link>

</td>

              <td>

                <span className="type-badge">

                  {flag.type}

                </span>

              </td>

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

              <td>

                {flag.owner_team}

              </td>
              <td>
    <div className="action-buttons">
        <button
            className="edit-btn"
            onClick={() => onEdit(flag)}
        >
            ✏ Edit
        </button>
    </div>
</td>

            </tr>

          ))

        ) : (

          <tr>

            <td colSpan="5" className="empty-state">

              No Feature Flags Found

            </td>

          </tr>

        )}

      </tbody>

    </table>
  );
}

export default FlagTable;