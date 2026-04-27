import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
      : new Date(a.createdAt);
    const bTime = b.messages?.length
      ? new Date(b.messages[b.messages.length - 1].createdAt)
      : new Date(b.createdAt);
    return bTime - aTime;
  });

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

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
              m.userId !== currentUserId &&
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

  const markChatRead = useCallback(
    async (chatId) => {
      try {
        await fetcher(`/api/chats/read/${chatId}`, { method: "PUT" });
      } catch (e) {
        console.warn(e);
      }
      setLastRead(chatId);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unread: 0 } : chat
        )
      );
    },
    [fetcher]
  );

  const fetchAndAddChat = useCallback(
    async (chatId, incomingMessage) => {
      try {
        const chatDetail = await fetcher(`/api/chats/${chatId}`);
        const unread =
          incomingMessage && incomingMessage.userId !== currentUserId ? 1 : 0;

        const fullChat = {
          ...chatDetail,
          messages: chatDetail.messages || [],
          typing: false,
          unread,
          lastMessage: incomingMessage?.text || "",
        };

        setChats((prev) => {
          const exists = prev.find((c) => c.id === chatId);
          if (exists) {
            return sortByLatest(
              prev.map((c) =>
                c.id === chatId
                  ? { ...fullChat, unread: c.unread }
                  : c
              )
            );
          }
          return sortByLatest([...prev, fullChat]);
        });
      } catch (err) {
        console.error("fetchAndAddChat error:", err);
      }
    },
    [currentUserId, fetcher]
  );

  const addMessage = useCallback((chatId, message) => {
    setChats((prev) => {
      const updated = prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const alreadyExists = chat.messages.some((m) => m.id === message.id);
        if (alreadyExists) return chat;
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.text,
        };
      });
      return sortByLatest(updated);
    });
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

  const ensureChat = useCallback(
    async (ownerId) => {
      const existing = chats.find((c) => c.userIDs?.includes(ownerId));
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
    },
    [chats, fetcher]
  );

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};