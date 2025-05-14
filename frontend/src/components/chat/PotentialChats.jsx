import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, userChats } = useContext(ChatContext);

  // Filter out users we already have chats with
  const availableUsers = potentialChats?.filter((u) => {
    return !userChats?.some((chat) => chat.members?.includes(u.id));
  });

  return (
    <div className="all-users">
      {availableUsers?.map((u) => (
        <div
          className="single-user"
          key={u.id}
          onClick={() => createChat(user.id, u.id)}
        >
          {u.fullName}
          {u.isOnline && <span className="user-online"></span>}
        </div>
      ))}
    </div>
  );
};

export default PotentialChats;
