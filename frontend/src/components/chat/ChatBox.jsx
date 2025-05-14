import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, areMessagesLoading } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);

  console.log("Debug - currentChat:", currentChat);
  console.log("Debug - messages:", messages);
  console.log("Debug - recipientUser:", recipientUser);

  if (!currentChat) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet...
      </p>
    );
  }

  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Loading recipient info...
      </p>
    );
  }

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser.fullName}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user?.id
                  ? "message self align-self-end flex-grow-0 "
                  : "message align-self-start flex-grow-0 "
              }`}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAT).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

export default ChatBox;
