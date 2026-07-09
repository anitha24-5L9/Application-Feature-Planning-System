function FlagTable({ flags }) {
  return (
    <table className="flag-table">

      <thead>

        <tr>

          <th>Feature</th>

          <th>Type</th>

          <th>Status</th>

          <th>Owner Team</th>

        </tr>

      </thead>

      <tbody>

        {flags.length > 0 ? (

          flags.map((flag) => (

            <tr key={flag.id}>

              <td>

                <strong>{flag.key}</strong>

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

            </tr>

          ))

        ) : (

          <tr>

            <td colSpan="4" className="empty-state">

              No Feature Flags Found

            </td>

          </tr>

        )}

      </tbody>

    </table>
  );
}

export default FlagTable;