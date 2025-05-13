import React, { useContext } from "react";
import { Spinner, Alert, Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { UserChat } from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";

export const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  if (isUserChatsLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (userChatsError) {
    return (
      <Alert variant="danger">
        {userChatsError.message || "Failed to load chats"}
      </Alert>
    );
  }

  if (!userChats) {
    return <div>No chats found</div>;
  }

  return (
    <Container>
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="flex-grow-0 message-box pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats ...</p>}
            {userChats.map((chat, index) => {
              return (
                <div key={index}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <p>ChatBox</p>
        </Stack>
      )}
    </Container>
  );
};
