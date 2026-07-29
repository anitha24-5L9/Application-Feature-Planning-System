import "../styles/AuditLogs.css";

const auditLogs = [
  {
    id: 1,
    timestamp: "2026-07-29 10:15 AM",
    actor: "Admin",
    flag: "login",
    action: "Updated Rollout"
  },
  {
    id: 2,
    timestamp: "2026-07-29 11:05 AM",
    actor: "Developer",
    flag: "payment",
    action: "Environment Override"
  },
  {
    id: 3,
    timestamp: "2026-07-29 12:20 PM",
    actor: "Tester",
    flag: "checkout",
    action: "User Targeting"
  }
];

function AuditLogs() {
  return (
    <div className="audit-container">

      <h2>Audit Log Viewer</h2>

      <table className="audit-table">

        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Flag</th>
            <th>Action Type</th>
            <th>View Diff</th>
          </tr>
        </thead>

        <tbody>

          {auditLogs.map((log) => (

            <tr key={log.id}>

              <td>{log.timestamp}</td>

              <td>{log.actor}</td>

              <td>{log.flag}</td>

              <td>
  <span
    className={`action-badge ${
      log.action === "Updated Rollout"
        ? "rollout"
        : log.action === "Environment Override"
        ? "environment"
        : "targeting"
    }`}
  >
    {log.action}
  </span>
</td>

              <td>
                <button className="diff-btn">
                  View Diff
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AuditLogs;