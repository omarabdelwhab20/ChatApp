// utils/auth.js
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}auth/verify-email/${token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json", // Explicitly request JSON
        },
      }
    );

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status}: ${text.slice(0, 100)}...`
      );
    }

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: error.message || "Verification failed",
    };
  }
};
