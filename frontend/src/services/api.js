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
export async function getFlag(key) {
  console.log("Calling:", `${API_URL}/flags/${key}`);

  const response = await fetch(`${API_URL}/flags/${key}`);

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error("Failed to fetch flag");
  }

  const data = await response.json();

  console.log("Response data:", data);

  return data;
}
export async function getTargetUsers(flagKey) {

  const response = await fetch(
    `http://127.0.0.1:8000/targeting/users/${flagKey}`
  );

  return response.json();

}

export async function addTargetUser(flagKey, userId) {

  await fetch(
    "http://127.0.0.1:8000/targeting/users/",
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

}

export async function removeTargetUser(flagKey, userId) {

  await fetch(

    `http://127.0.0.1:8000/targeting/users/${flagKey}/${userId}`,

    {
      method: "DELETE",
    }

  );

}

export async function getTargetGroups(flagKey) {
  const response = await fetch(
    `http://127.0.0.1:8000/targeting/groups/${flagKey}`
  );

  return response.json();
}


export async function addTargetGroup(data) {
  const response = await fetch(
    "http://127.0.0.1:8000/targeting/groups/",
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
    `http://127.0.0.1:8000/targeting/groups/${flagKey}/${groupName}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

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

  if (!response.ok) {
    throw new Error("Failed to update rollout percentage");
  }

  return response.json();
}