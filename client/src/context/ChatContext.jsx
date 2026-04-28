import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

export const ChatContext = createContext();

const API_BASE = "https://findhome-platform-api-sk.onrender.com" || "http://localhost:3000";

const getLastRead = (chatId) => {
  const stored = localStorage.getItem(`chat_last_read_${chatId}`);
  return stored ? new Date(stored) : null;
};

export const setLastRead = (chatId, time = new Date()) => {
  localStorage.setItem(`chat_last_read_${chatId}`, time.toISOString());
};

const sortByLatest = (chats) =>
  [...chats].sort((a, b) => {
    const aTime = a.messages?.length
      ? new Date(a.messages[a.messages.length - 1].createdAt)
      : new Date(a.createdAt || 0);
    const bTime = b.messages?.length
      ? new Date(b.messages[b.messages.length - 1].createdAt)
      : new Date(b.createdAt || 0);
    return bTime - aTime;
  });

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [chats, setChats] = useState([]);
  // Track which chatId is currently open — set by Messages.jsx via setActiveChatId
  const [activeChatId, setActiveChatId] = useState(null);

  const currentUserId =
    currentUser?.userData?.id ||
    currentUser?.id ||
    currentUser?._id;

  const fetcher = useCallback(async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const loadChats = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const data = await fetcher("/api/chats");
      const processed = data.map((chat) => {
        const lastRead = getLastRead(chat.id);
        const unread =
          chat.messages?.filter(
            (m) =>
              String(m.userId) !== String(currentUserId) &&
              (!lastRead || new Date(m.createdAt) > lastRead)
          ).length || 0;
        return { ...chat, messages: chat.messages || [], typing: false, unread };
      });
      setChats(sortByLatest(processed));
    } catch (err) {
      console.error("loadChats error:", err);
    }
  }, [currentUserId, fetcher]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const markChatRead = useCallback(async (chatId) => {
    try {
      await fetcher(`/api/chats/read/${chatId}`, { method: "PUT" });
    } catch (e) {
      console.warn("markChatRead error:", e);
    }
    setLastRead(chatId);
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }, [fetcher]);

  const fetchAndAddChat = useCallback(async (chatId, incomingMessage) => {
    try {
      const chatDetail = await fetcher(`/api/chats/${chatId}`);
      const unread =
        incomingMessage &&
        String(incomingMessage.userId) !== String(currentUserId)
          ? 1
          : 0;

      const fullChat = {
        ...chatDetail,
        messages: chatDetail.messages || [],
        typing: false,
        unread,
        lastMessage:
          incomingMessage?.text ||
          chatDetail.messages?.at(-1)?.text ||
          "",
      };

      setChats((prev) => {
        const exists = prev.find((c) => c.id === chatId);
        if (exists) {
          return sortByLatest(
            prev.map((c) =>
              c.id === chatId ? { ...fullChat, unread: c.unread } : c
            )
          );
        }
        return sortByLatest([...prev, fullChat]);
      });

      return fullChat;
    } catch (err) {
      console.error("fetchAndAddChat error:", err);
      return null;
    }
  }, [currentUserId, fetcher]);

  const addMessage = useCallback((chatId, message, senderInfo = null) => {
    setChats((prev) =>
      sortByLatest(
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          if (chat.messages.some((m) => m.id === message.id)) return chat;

          const hasValidReceiver =
            chat.receiver?.username &&
            chat.receiver.username !== "Unknown";

          const patchedReceiver =
            !hasValidReceiver && senderInfo
              ? { ...(chat.receiver || {}), ...senderInfo }
              : chat.receiver;

          return {
            ...chat,
            receiver: patchedReceiver,
            messages: [...chat.messages, message],
            lastMessage: message.text,
          };
        })
      )
    );
  }, []);

  const replaceMessage = useCallback((chatId, tempId, savedMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          messages: chat.messages.map((m) =>
            m.id === tempId ? { ...savedMessage, pending: false } : m
          ),
        };
      })
    );
  }, []);

  const removeMessage = useCallback((chatId, msgId) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          messages: chat.messages.filter((m) => m.id !== msgId),
        };
      })
    );
  }, []);

  const incrementUnread = useCallback((chatId) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, unread: (chat.unread || 0) + 1 }
          : chat
      )
    );
  }, []);

  const setTyping = useCallback((chatId, value) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, typing: value } : chat
      )
    );
  }, []);

  const ensureChat = useCallback(async (ownerId) => {
    const existing = chats.find((c) =>
      c.userIDs?.map(String).includes(String(ownerId))
    );
    if (existing) return existing;

    try {
      const newChat = await fetcher("/api/chats", {
        method: "POST",
        body: JSON.stringify({ receiverId: ownerId }),
      });
      const chatDetail = await fetcher(`/api/chats/${newChat.id}`);
      const fullChat = {
        ...chatDetail,
        messages: chatDetail.messages || [],
        typing: false,
        unread: 0,
      };
      setChats((prev) => sortByLatest([...prev, fullChat]));
      return fullChat;
    } catch (err) {
      console.error("ensureChat error:", err);
      return null;
    }
  }, [chats, fetcher]);

  // ✅ GLOBAL socket listener — lives in context so it works on ANY page
  const activeChatIdRef = React.useRef(activeChatId);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const onReceiveMessage = ({ chatId, message }) => {
      const isFromOther = String(message.userId) !== String(currentUserId);
      const isActive = chatId === activeChatIdRef.current;

      // Sender info attached by socket server — fixes Unknown name/avatar
      const senderInfo =
        message.senderUsername
          ? { username: message.senderUsername, avatar: message.senderAvatar || null }
          : null;

      setChats((prevChats) => {
        const chatExists = prevChats.find((c) => c.id === chatId);

        if (!chatExists) {
          // ✅ Brand new chat — fetch full details regardless of which page user is on
          fetchAndAddChat(chatId, message);
          return prevChats;
        }

        // Duplicate guard
        if (chatExists.messages.some((m) => m.id === message.id)) return prevChats;

        // ✅ Patch receiver immediately using senderInfo from socket
        const hasValidReceiver =
          chatExists.receiver?.username &&
          chatExists.receiver.username !== "Unknown";

        const patchedReceiver =
          !hasValidReceiver && senderInfo
            ? { ...(chatExists.receiver || {}), ...senderInfo }
            : chatExists.receiver;

        return sortByLatest(
          prevChats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              receiver: patchedReceiver,
              messages: [...chat.messages, message],
              lastMessage: message.text,
              unread: isFromOther && !isActive
                ? (chat.unread || 0) + 1
                : chat.unread,
            };
          })
        );
      });

      if (isFromOther && isActive) {
        markChatRead(chatId);
      }
    };

    const onTyping = ({ chatId, userId }) => {
      if (String(userId) === String(currentUserId)) return;
      setTyping(chatId, true);
      setTimeout(() => setTyping(chatId, false), 2000);
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("typing", onTyping);
    };
  }, [socket, currentUserId, fetchAndAddChat, markChatRead, setTyping]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        loadChats,
        markChatRead,
        fetchAndAddChat,
        addMessage,
        replaceMessage,
        removeMessage,
        incrementUnread,
        setTyping,
        ensureChat,
        currentUserId,
        fetcher,
        sortByLatest,
        activeChatId,
        setActiveChatId, // ✅ Messages.jsx calls this when opening a chat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};