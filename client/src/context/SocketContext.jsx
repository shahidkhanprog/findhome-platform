import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  const currentUserId =
    currentUser?.userData?.id || currentUser?.id || currentUser?._id;

  const username =
    currentUser?.userData?.username || currentUser?.username || null;

  const avatar =
    currentUser?.userData?.avatar || currentUser?.avatar || null;

  // ✅ Effect 1 — create/destroy socket ONLY on login/logout (userId change)
  //    Never re-create the socket just because username/avatar changed
  useEffect(() => {
    if (!currentUserId) return;

    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [currentUserId]); // ← intentionally NOT including username/avatar

  // ✅ Effect 2 — (re)register user info without reconnecting the socket
  //    Runs when socket is ready OR when profile info changes
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const register = () =>
      socket.emit("newUser", { userId: currentUserId, username, avatar });

    if (socket.connected) {
      register();
    } else {
      socket.once("connect", register);
    }

    return () => socket.off("connect", register);
  }, [socket, currentUserId, username, avatar]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};