const API_URL = "http://127.0.0.1:8000";

export async function getFlags() {
  console.log("Calling:", `${API_URL}/flags/`);

  const response = await fetch(`${API_URL}/flags/`);

  console.log("Response status:", response.status);

  const data = await response.json();

  console.log("Response data:", data);

  return data;
}
export async function createFlag(flag) {
  console.log("Calling:", `${API_URL}/flags/`);
  const response = await fetch(`${API_URL}/flags/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flag),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error("Failed to create flag");
  }

  return response.json();
}