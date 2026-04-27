import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── LocalStorage helpers for unread tracking ─────────────────────────────────
const getLastRead = (chatId) => {
  const stored = localStorage.getItem(`chat_last_read_${chatId}`);
  return stored ? new Date(stored) : null;
};

export const setLastRead = (chatId, time = new Date()) => {
  localStorage.setItem(`chat_last_read_${chatId}`, time.toISOString());
};

// ─── Sort chats newest-first by last message time ─────────────────────────────
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
  const [chats, setChats] = useState([]);

  const currentUserId =
    currentUser?.userData?.id ||
    currentUser?.id ||
    currentUser?._id;

  // ─── Authenticated fetch helper ───────────────────────────────────────────
  const fetcher = useCallback(async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  // ─── Load all chats on mount ──────────────────────────────────────────────
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

  // ─── Mark a chat as read ──────────────────────────────────────────────────
  const markChatRead = useCallback(
    async (chatId) => {
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
    },
    [fetcher]
  );

  // ─── Fetch a full chat from the server and upsert into state ─────────────
  //     Called when a brand-new chat arrives via socket (receiver side)
  //     or when receiver info is missing entirely
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
          lastMessage:
            incomingMessage?.text ||
            chatDetail.lastMessage ||
            chatDetail.messages?.at(-1)?.text ||
            "",
        };

        setChats((prev) => {
          const exists = prev.find((c) => c.id === chatId);
          if (exists) {
            // Update receiver + messages but preserve current unread count
            return sortByLatest(
              prev.map((c) =>
                c.id === chatId ? { ...fullChat, unread: c.unread } : c
              )
            );
          }
          return sortByLatest([...prev, fullChat]);
        });

        return fullChat; // ✅ returned so callers (ChatDrawer) can use it
      } catch (err) {
        console.error("fetchAndAddChat error:", err);
        return null;
      }
    },
    [currentUserId, fetcher]
  );

  // ─── Add a single message to an existing chat ─────────────────────────────
  //     senderInfo: { username, avatar } — passed from socket enriched message
  //     so we can patch an "Unknown" receiver immediately without a fetch
  const addMessage = useCallback((chatId, message, senderInfo = null) => {
    setChats((prev) =>
      sortByLatest(
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          // Avoid duplicates (optimistic + real message)
          if (chat.messages.some((m) => m.id === message.id)) return chat;

          // ✅ Patch receiver inline if it's missing/Unknown and we have senderInfo
          const hasValidReceiver =
            chat.receiver?.username &&
            chat.receiver.username !== "Unknown";

          const patchedReceiver =
            !hasValidReceiver && senderInfo
              ? {
                  ...(chat.receiver || {}),
                  username: senderInfo.username || "Unknown",
                  avatar: senderInfo.avatar || null,
                }
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

  // ─── Replace a temp (optimistic) message with the saved DB message ────────
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

  // ─── Remove a message by id ───────────────────────────────────────────────
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

  // ─── Increment unread counter ─────────────────────────────────────────────
  const incrementUnread = useCallback((chatId) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, unread: (chat.unread || 0) + 1 }
          : chat
      )
    );
  }, []);

  // ─── Toggle typing indicator ──────────────────────────────────────────────
  const setTyping = useCallback((chatId, value) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, typing: value } : chat
      )
    );
  }, []);

  // ─── Get or create a chat with ownerId, returns full chat object ──────────
  const ensureChat = useCallback(
    async (ownerId) => {
      // Check if chat already exists in state
      const existing = chats.find((c) =>
        c.userIDs?.includes(String(ownerId)) ||
        c.userIDs?.includes(Number(ownerId))
      );
      if (existing) return existing;

      try {
        // Create new chat on server
        const newChat = await fetcher("/api/chats", {
          method: "POST",
          body: JSON.stringify({ receiverId: ownerId }),
        });

        // Fetch full details (includes receiver user object)
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