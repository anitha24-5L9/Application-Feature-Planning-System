const API_URL = "http://127.0.0.1:8000";

export async function getAuditLogs() {

    const response = await fetch(`${API_URL}/audit/`);

    if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
    }

    return response.json();
}