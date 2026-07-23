const API_URL = "http://127.0.0.1:8000";

// ==========================================
// Feature Flag APIs
// ==========================================

export async function getFlags() {
  const response = await fetch(`${API_URL}/flags/`);

  if (!response.ok) {
    throw new Error("Failed to fetch flags");
  }

  return response.json();
}

export async function getFlag(key) {
  const response = await fetch(`${API_URL}/flags/${key}`);

  if (!response.ok) {
    throw new Error("Failed to fetch flag");
  }

  return response.json();
}

export async function createFlag(flag) {
  const response = await fetch(`${API_URL}/flags/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flag),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create flag");
  }

  return data;
}

// ==========================================
// Target User APIs
// ==========================================

export async function getTargetUsers(flagKey) {
  const response = await fetch(
    `${API_URL}/targeting/users/${flagKey}`
  );

  return response.json();
}

export async function addTargetUser(flagKey, userId) {
  const response = await fetch(
    `${API_URL}/targeting/users/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flag_key: flagKey,
        user_id: userId,
      }),
    }
  );

  return response.json();
}

export async function removeTargetUser(flagKey, userId) {
  const response = await fetch(
    `${API_URL}/targeting/users/${flagKey}/${userId}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

// ==========================================
// Target Group APIs
// ==========================================

export async function getTargetGroups(flagKey) {
  const response = await fetch(
    `${API_URL}/targeting/groups/${flagKey}`
  );

  return response.json();
}

export async function addTargetGroup(data) {
  const response = await fetch(
    `${API_URL}/targeting/groups/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function removeTargetGroup(flagKey, groupName) {
  const response = await fetch(
    `${API_URL}/targeting/groups/${flagKey}/${groupName}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

// ==========================================
// Percentage Rollout APIs
// ==========================================

export async function getRolloutPercentage(flagKey) {
  const response = await fetch(
    `${API_URL}/flags/${flagKey}/rollout`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch rollout percentage");
  }

  return response.json();
}

export async function updateRolloutPercentage(flagKey, percentage) {
  const response = await fetch(
    `${API_URL}/flags/${flagKey}/rollout`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rollout_percentage: percentage,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update rollout");
  }

  return data;
}

// ==========================================
// Environment CRUD APIs
// ==========================================

export async function getEnvironments() {
  const response = await fetch(`${API_URL}/environments/`);

  if (!response.ok) {
    throw new Error("Failed to fetch environments");
  }

  return response.json();
}

export async function createEnvironment(name) {
  const response = await fetch(`${API_URL}/environments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create environment");
  }

  return data;
}

export async function updateEnvironment(id, name) {
  const response = await fetch(
    `${API_URL}/environments/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update environment");
  }

  return data;
}

export async function deleteEnvironment(id) {
  const response = await fetch(
    `${API_URL}/environments/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete environment");
  }

  return data;
}

// ==========================================
// Environment Override APIs
// ==========================================

export async function getEnvironmentOverrides(flagKey) {
  const response = await fetch(
    `${API_URL}/environment-overrides/${flagKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch environment overrides");
  }

  return response.json();
}

export async function saveEnvironmentOverride(data) {
  const response = await fetch(
    `${API_URL}/environment-overrides/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to save override");
  }

  return result;
}

// ==========================================
// Evaluation API
// ==========================================

export async function evaluateFlag(data) {
  const response = await fetch(`${API_URL}/evaluate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Evaluation failed");
  }

  return result;
}