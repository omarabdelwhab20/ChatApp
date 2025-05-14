import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  // State initialization
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]); // Initialize as empty array
  const [areMessagesLoading, setAreMessagesLoading] = useState(false);
  const [messageError, setMessagesError] = useState(null);

  // Fetch potential chats
  useEffect(() => {
    const getPotentialChats = async () => {
      try {
        const response = await getRequest(
          `${import.meta.env.VITE_SERVER_URL}auth/find-all`
        );

        if (response.error) return;

        const filteredChats = (response.users || []).filter((u) => {
          // Skip current user and users already in chats
          return (
            u.id !== user?.id &&
            !userChats.some((chat) => chat.members?.includes(u.id))
          );
        });

        setPotentialChats(filteredChats);
      } catch (error) {
        console.error("Failed to fetch potential chats:", error);
      }
    };

    getPotentialChats();
  }, [userChats, user?.id]);

  // Fetch user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (!user?.id) return;

      setIsUserChatsLoading(true);
      try {
        const response = await getRequest(
          `${import.meta.env.VITE_SERVER_URL}chat/my-chats`
        );

        if (response.error) throw response;
        setUserChats(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setUserChatsError({
          error: true,
          message: error.message || "Failed to load chats",
        });
      } finally {
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();
  }, [user?.id]);

  // Fetch messages when current chat changes
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?.id) {
        setMessages([]);
        return;
      }

      setAreMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await getRequest(
          `${import.meta.env.VITE_SERVER_URL}message/${currentChat.id}`
        );

        if (response.error) throw response;

        // Ensure we always set an array
        const messagesData = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];

        setMessages(messagesData);
      } catch (error) {
        setMessagesError(error);
        console.error("Failed to load messages:", error);
      } finally {
        setAreMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat?.id]);

  // Update current chat with useCallback
  const updateCurrentChat = useCallback((chat) => {
    if (chat?.id) {
      setCurrentChat(chat);
    }
  }, []);

  // Create new chat
  const createChat = useCallback(async (senderId, receiverId) => {
    try {
      const response = await postRequest(
        `${import.meta.env.VITE_SERVER_URL}chat`,
        { senderId, receiverId }
      );

      if (response.error) throw response;

      const newChat = {
        ...response,
        members: [senderId, receiverId],
        id: response.id || Date.now().toString(),
      };

      setUserChats((prev) => [...prev, newChat]);
      setPotentialChats((prev) => prev.filter((u) => u.id !== receiverId));
      setCurrentChat(newChat); // Automatically select the new chat

      return newChat;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        currentChat,
        messages,
        areMessagesLoading,
        messageError,
        createChat,
        updateCurrentChat, // Fixed typo from updatedCurentChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
