import { useEffect, useMemo, useState } from "react";
import "../styles/AuditLogs.css";
import { getAuditLogs } from "../services/auditService";

function AuditLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [actorFilter, setActorFilter] = useState("");
    const [flagFilter, setFlagFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [selectedLog, setSelectedLog] = useState(null);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to load audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {

            const actorMatch =
                actorFilter === "" ||
                log.actor.toLowerCase().includes(actorFilter.toLowerCase());

            const flagMatch =
                flagFilter === "" ||
                log.flag_key.toLowerCase().includes(flagFilter.toLowerCase());

            const dateMatch =
                dateFilter === "" ||
                log.timestamp.slice(0, 10) === dateFilter;

            return actorMatch && flagMatch && dateMatch;

        });
    }, [logs, actorFilter, flagFilter, dateFilter]);

    return (

        <div className="audit-container">

            <h2>Audit Log Viewer</h2>

            <div className="audit-filters">

                <div className="filter-group">

                    <label>Actor</label>

                    <input
                        type="text"
                        placeholder="Search actor..."
                        value={actorFilter}
                        onChange={(e) => setActorFilter(e.target.value)}
                    />

                </div>

                <div className="filter-group">

                    <label>Flag</label>

                    <input
                        type="text"
                        placeholder="Search flag..."
                        value={flagFilter}
                        onChange={(e) => setFlagFilter(e.target.value)}
                    />

                </div>

                <div className="filter-group">

                    <label>Date</label>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />

                </div>

                <button
                    className="refresh-btn"
                    onClick={loadLogs}
                >
                    Refresh
                </button>

            </div>

            {loading ? (

                <p>Loading audit logs...</p>

            ) : (

                <table className="audit-table">

                    <thead>

                        <tr>

                            <th>Timestamp</th>
                            <th>Actor</th>
                            <th>Flag</th>
                            <th>Action</th>
                            <th>View Diff</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredLogs.length === 0 ? (

                            <tr>

                                <td colSpan="5">
                                    No audit logs found.
                                </td>

                            </tr>

                        ) : (

                            filteredLogs.map((log) => (

                                <tr key={log.id}>

                                    <td>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>

                                    <td>{log.actor}</td>

                                    <td>{log.flag_key}</td>

                                    <td>

                                        <span
                                            className={`action-badge ${log.action.toLowerCase()}`}
                                        >
                                            {log.action}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="diff-btn"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            View Diff
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            )}

            {selectedLog && (

                <div className="modal-overlay">

                    <div className="diff-modal">

                        <h2>Audit Change Details</h2>

                        <div className="diff-section">

                            <div>

                                <h3>Before</h3>

                                <pre>
{JSON.stringify(selectedLog.details.before, null, 2)}
                                </pre>

                            </div>

                            <div>

                                <h3>After</h3>

                                <pre>
{JSON.stringify(selectedLog.details.after, null, 2)}
                                </pre>

                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                className="close-btn"
                                onClick={() => setSelectedLog(null)}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default AuditLogs;