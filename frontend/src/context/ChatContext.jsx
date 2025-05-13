import { createContext, useEffect, useState } from "react";
import { getRequest } from "../utils/services";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        try {
          const response = await getRequest(
            `${import.meta.env.VITE_SERVER_URL}chat/my-chats`
          );

          if (response.error) {
            setUserChatsError(response);
          } else {
            setUserChats(response.data); // Note: using response.data
          }
        } catch (error) {
          setUserChatsError({
            error: true,
            message: error.message || "Failed to load chats",
          });
        } finally {
          setIsUserChatsLoading(false);
        }
      }
    };

    getUserChats();
  }, [user?.id]); // More specific dependency

  return (
    <ChatContext.Provider
      value={{ userChats, isUserChatsLoading, userChatsError }}
    >
      {children}
    </ChatContext.Provider>
  );
};
