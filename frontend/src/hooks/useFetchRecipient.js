import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const recipientId = chat?.members?.find((id) => id !== user?.id);



  useEffect(() => {
    let isMounted = true; // Cleanup flag

    const fetchRecipient = async () => {
      if (!recipientId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `${import.meta.env.VITE_SERVER_URL}auth/find-user/${recipientId}`
        );

        if (isMounted) {
          if (response.error) {
            throw new Error(response.message || "Failed to fetch recipient");
          }
          setRecipientUser(response.data || response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unknown error occurred");
          console.error("Fetch recipient error:", err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecipient();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [chat?.members, user?.id , recipientId]); // Depend on these values

  return { recipientUser, isLoading, error };
};
