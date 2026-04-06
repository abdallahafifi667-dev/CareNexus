import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      const socketInstance = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:8080",
        {
          auth: { token },
          path: "/socket.io/",
          transports: ["polling"], // Fixed WebSocket connection issue (Invalid frame header) by using polling as primary
          withCredentials: true,
        },
      );

      socketInstance.on("connect", () => {
        console.log("Connected to socket server");
        // Join private room
        socketInstance.emit("join_room", user._id || user.id);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
