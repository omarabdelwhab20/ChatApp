export const postRequest = async (url, body) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Add this line
      },

      body: JSON.stringify(body), // Only stringify here
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: true,
        message: errorData.message || "Request failed",
        status: response.status,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: error.message || "Network error",
    };
  }
};

// services.js - Update getRequest
export const getRequest = async (url) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      error: true,
      message: data.message || "Request failed",
      status: response.status,
    };
  }

  return data;
};
