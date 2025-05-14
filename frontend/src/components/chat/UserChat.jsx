import { useFetchRecipient } from "../../hooks/useFetchRecipient.js";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { Spinner } from "react-bootstrap";

export const UserChat = ({ chat, user }) => {
  const { recipientUser, isLoading } = useFetchRecipient(chat, user);



  if (isLoading) {
    return (
      <Stack className="justify-content-center align-items-center p-2">
        <Spinner animation="border" size="sm" />
      </Stack>
    );
  }

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" alt="" />
        </div>
        <div className="text-content">
          <div className="name">
            {recipientUser?.fullName ||
              `User ${chat?.members
                ?.find((id) => id !== user?.id)
                ?.slice(0, 4)}` ||
              "Unknown User"}
          </div>
          <div className="text">Text Messages</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">12/12/2022</div>
        <div className="this-user-notifications">2</div>
        <span className="user-online"></span>
      </div>
    </Stack>
  );
};
