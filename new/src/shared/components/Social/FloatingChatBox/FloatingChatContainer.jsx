import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FloatingChatBox from "./FloatingChatBox";
import { closeChat } from "../../../stores/chatSlice";
import "./FloatingChatContainer.scss";

const FloatingChatContainer = () => {
  const { activeChats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleClose = (friendId) => {
    dispatch(closeChat(friendId));
  };

  return (
    <div className="chat-windows-manager">
      {activeChats.map((chat) => (
        <FloatingChatBox
          key={chat.id || chat._id}
          activeFriend={chat}
          onClose={() => handleClose(chat.id || chat._id)}
        />
      ))}
    </div>
  );
};

export default FloatingChatContainer;
