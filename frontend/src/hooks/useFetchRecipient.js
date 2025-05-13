import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

// useFetchRecipient.js
export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const recipientId = chat?.members?.find((id) => id !== user?.id);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (!recipientId) {
        setRecipientUser(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getRequest(
          `${import.meta.env.VITE_SERVER_URL}auth/find-user/${recipientId}`
        );

        if (response.error || !response.data) {
          throw new Error(response.message || "Recipient not found");
        }

        setRecipientUser(response.data); // Now using response.data
      } catch (err) {
        setError(err);
        setRecipientUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipient();
  }, [recipientId]);

  return { recipientUser, isLoading, error };
};
