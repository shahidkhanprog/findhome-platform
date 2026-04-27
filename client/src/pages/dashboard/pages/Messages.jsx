import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  MdSearch, MdMoreVert, MdSend, MdDone, MdDoneAll,
  MdArrowBack, MdFilterList, MdEdit, MdClose, MdCheck,
  MdDeleteOutline, MdOutlineMarkChatRead, MdKeyboardArrowDown,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";
import { SocketContext } from "../../../context/SocketContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 12‑hour time with AM/PM
const format12HourTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

// Last‑read storage
const getLastRead = (chatId) => {
  const stored = localStorage.getItem(`chat_last_read_${chatId}`);
  return stored ? new Date(stored) : null;
};
const setLastRead = (chatId, time = new Date()) => {
  localStorage.setItem(`chat_last_read_${chatId}`, time.toISOString());
};

const sortChatsByLatestMessage = (chats) => {
  return [...chats].sort((a, b) => {
    const aTime = a.messages?.length
      ? new Date(a.messages[a.messages.length - 1].createdAt)
      : new Date(a.createdAt);
    const bTime = b.messages?.length
      ? new Date(b.messages[b.messages.length - 1].createdAt)
      : new Date(b.createdAt);
    return bTime - aTime;
  });
};

// Avatar Component – no online dot
const Avatar = ({ contact, size = "md" }) => {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const initials = contact?.username?.slice(0, 2).toUpperCase() || "??";
  const color = "from-violet-400 to-purple-500";
  return (
    <div className={`relative flex-shrink-0 ${sz[size]}`}>
      <div className={`${sz[size]} rounded-2xl bg-gray-900 flex items-center justify-center font-bold text-white select-none`}>
        {contact?.avatar ? (
          <img src={contact.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          initials
        )}
      </div>
    </div>
  );
};

// Message Bubble (text only)
const MessageBubble = ({ msg, onDelete, selected, onSelect, selectMode, isMe }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!showActions) return;
    const handler = (e) => { if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActions(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  const timeStr = msg.createdAt ? format12HourTime(msg.createdAt) : msg.time;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1.5 group`} onClick={() => selectMode && onSelect(msg.id)}>
      {selectMode && (
        <div className={`flex items-end pb-2 ${isMe ? "order-2 ml-2" : "mr-2"}`}>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${selected ? "bg-[#f36c3a] border-violet-600" : "border-slate-300 bg-white"}`}>
            {selected && <MdCheck size={12} className="text-white" />}
          </div>
        </div>
      )}
      <div className={`relative max-w-[70%] ${selectMode ? "cursor-pointer" : ""}`}>
        {!selectMode && (
          <div ref={actionsRef} className={`absolute top-1 ${isMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
            <button onClick={() => setShowActions(true)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm">
              <MdMoreVert size={13} />
            </button>
            {showActions && (
              <div className={`absolute top-7 ${isMe ? "right-0" : "left-0"} bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-20 min-w-[140px]`}>
                <button onClick={() => { onDelete(msg.id); setShowActions(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-rose-500 hover:bg-rose-50">
                  <MdDeleteOutline size={14} /> Delete message
                </button>
              </div>
            )}
          </div>
        )}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-[#f36c3a] text-white rounded-br-sm" : "bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100"}`}>
          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className={`text-[10px] ${isMe ? "text-violet-300" : "text-slate-400"}`}>{timeStr}</span>
            {isMe && (msg.read ? <MdDoneAll size={12} className="text-violet-300" /> : <MdDone size={12} className="text-violet-400" />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-2">
    <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
      ))}
    </div>
  </div>
);

const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[11px] font-medium text-slate-400 px-2">{label}</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

const getDateGroup = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const groupMessagesByDate = (messages) => {
  const items = [];
  let lastGroup = null;
  messages.forEach((msg) => {
    const group = getDateGroup(msg.createdAt);
    if (group !== lastGroup) {
      items.push({ type: "divider", label: group });
      lastGroup = group;
    }
    items.push({ type: "msg", msg });
  });
  return items;
};

// MAIN COMPONENT (no online status)
export default function Messages() {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const filterRef = useRef(null);

  const currentUserId = currentUser?.id || currentUser?.userData?.id || currentUser?._id;

  const fetcher = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const getReceiverId = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.userIDs?.find(id => id !== currentUserId);
  };

  const fetchChat = async (chatId) => {
    try {
      const allChats = await fetcher("/api/chats");
      const chat = allChats.find(c => c.id === chatId);
      if (!chat) return null;
      const lastRead = getLastRead(chat.id);
      const unread = chat.messages?.filter(m =>
        m.userId !== currentUserId && (!lastRead || new Date(m.createdAt) > lastRead)
      ).length || 0;
      return {
        ...chat,
        messages: chat.messages || [],
        typing: false,
        unread,
      };
    } catch (err) {
      console.error("Failed to fetch chat", err);
      return null;
    }
  };

  const loadChats = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const data = await fetcher("/api/chats");
      const processed = data.map(chat => {
        const lastRead = getLastRead(chat.id);
        const unread = chat.messages?.filter(m =>
          m.userId !== currentUserId && (!lastRead || new Date(m.createdAt) > lastRead)
        ).length || 0;
        return {
          ...chat,
          messages: chat.messages || [],
          typing: false,
          unread,
        };
      });
      setChats(sortChatsByLatestMessage(processed));
    } catch (err) {
      console.error("❌ loadChats error:", err);
    }
  }, [currentUserId]);

  useEffect(() => { loadChats(); }, [loadChats]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", async ({ chatId, message }) => {
      const existingChat = chats.find(c => c.id === chatId);
      if (existingChat) {
        setChats(prev => {
          const updated = prev.map(chat => {
            if (chat.id !== chatId) return chat;
            const isFromOther = message.userId !== currentUserId;
            const isActive = chat.id === activeChatId;
            let newUnread = chat.unread;
            if (isFromOther && !isActive) newUnread = (chat.unread || 0) + 1;
            else if (isActive && isFromOther) {
              fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
              setLastRead(chatId);
              newUnread = 0;
            }
            return {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message.text,
              unread: newUnread,
            };
          });
          return sortChatsByLatestMessage(updated);
        });
      } else {
        const newChat = await fetchChat(chatId);
        if (newChat) {
          setChats(prev => sortChatsByLatestMessage([...prev, newChat]));
        }
      }
    });

    socket.on("typing", ({ chatId, userId }) => {
      if (userId === currentUserId) return;
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, typing: true } : chat
      ));
      setTimeout(() => {
        setChats(prev => prev.map(chat =>
          chat.id === chatId ? { ...chat, typing: false } : chat
        ));
      }, 2000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [socket, activeChatId, currentUserId, chats]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeChatId) return;
    const tempId = Date.now();
    const newMsg = { id: tempId, text, createdAt: new Date(), userId: currentUserId, read: false, pending: true };
    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === activeChatId ? {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: text,
        } : chat
      );
      return sortChatsByLatestMessage(updated);
    });
    setInput("");
    try {
      const saved = await fetcher(`/api/messages/${activeChatId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setChats(prev => {
        const updated = prev.map(chat =>
          chat.id === activeChatId ? {
            ...chat,
            messages: chat.messages.map(m => m.id === tempId ? { ...saved, pending: false } : m)
          } : chat
        );
        return sortChatsByLatestMessage(updated);
      });
      setLastRead(activeChatId);
      socket?.emit("sendMessage", { chatId: activeChatId, message: saved, receiverId: getReceiverId(activeChatId) });
    } catch (err) {
      console.error("Send failed", err);
      setChats(prev => {
        const updated = prev.map(chat =>
          chat.id === activeChatId ? {
            ...chat,
            messages: chat.messages.filter(m => m.id !== tempId)
          } : chat
        );
        return sortChatsByLatestMessage(updated);
      });
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  let typingTimeout;
  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!activeChatId || !socket) return;
    socket.emit("typing", { chatId: activeChatId, receiverId: getReceiverId(activeChatId) });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId: activeChatId, receiverId: getReceiverId(activeChatId) });
    }, 1000);
  };

  const deleteMessage = async (msgId) => {
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId ? {
        ...chat,
        messages: chat.messages.filter(m => m.id !== msgId)
      } : chat
    ));
  };

  const openChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileView("chat");
    setSelectMode(false);
    setSelectedMsgIds([]);
    fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ));
    setLastRead(chatId);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteSelected = () => {
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId ? {
        ...chat,
        messages: chat.messages.filter(m => !selectedMsgIds.includes(m.id))
      } : chat
    ));
    setSelectMode(false);
    setSelectedMsgIds([]);
  };

  const toggleSelect = (msgId) => {
    setSelectedMsgIds(prev =>
      prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]
    );
  };

  const markContactRead = (chatId) => {
    fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ));
    setLastRead(chatId);
  };

  const deleteContact = async (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const filteredChats = chats.filter(chat => {
    const receiver = chat.receiver || {};
    const name = receiver.username || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? chat.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    if (!showScrollBtn) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-slate-50/40">
      <div className="w-20 h-20 rounded-3xl bg-gray-200 flex items-center justify-center mb-5">
        <svg className="w-9 h-9 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <p className="text-slate-700 font-semibold text-base mb-1.5">Select a conversation</p>
      <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">Choose a contact from the list to start messaging</p>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-112px)] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
      {/* Contact List Sidebar */}
      <div className={`flex flex-col w-full md:w-[320px] lg:w-[340px] flex-shrink-0 bg-white border-r border-slate-100 ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}>
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Messages</h2>
              {chats.reduce((sum, c) => sum + (c.unread || 0), 0) > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#f36c3a] text-white text-[10px] font-bold">
                  {chats.reduce((sum, c) => sum + (c.unread || 0), 0)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div ref={filterRef} className="relative">
                <button onClick={() => setShowFilterMenu(v => !v)} className={`w-8 h-8 flex items-center justify-center rounded-xl ${filter !== "all" ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>
                  <MdFilterList size={18} />
                </button>
                {showFilterMenu && (
                  <div className="absolute top-9 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 min-w-[150px]">
                    {["all", "unread"].map(f => (
                      <button key={f} onClick={() => { setFilter(f); setShowFilterMenu(false); }} className={`w-full flex items-center justify-between px-4 py-2.5 text-sm capitalize ${filter === f ? "text-violet-600 bg-gray-200 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                        {f} {filter === f && <MdCheck size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                <MdEdit size={18} />
              </button>
            </div>
          </div>
          {filter !== "all" && (
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 bg-violet-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {filter}
                <button onClick={() => setFilter("all")}><MdClose size={12} /></button>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-9 focus-within:border-violet-300">
            <MdSearch size={16} className="text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations…" className="flex-1 bg-transparent text-sm outline-none" />
            {search && <button onClick={() => setSearch("")}><MdClose size={14} /></button>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="text-3xl mb-3 opacity-30">🔍</div>
              <p className="text-sm font-medium text-slate-500">No conversations found</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const receiver = chat.receiver || { username: "Unknown", role: "User" };
              const unread = chat.unread || 0;
              const lastMsgTime = chat.messages?.length
                ? format12HourTime(chat.messages[chat.messages.length - 1].createdAt)
                : "";
              return (
                <button
                  key={chat.id}
                  onClick={() => openChat(chat.id)}
                  onContextMenu={(e) => { e.preventDefault(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-slate-50 border-r-2 ${activeChatId === chat.id ? "bg-gray-200 border-r-black" : "border-r-transparent"}`}
                >
                  <Avatar contact={receiver} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-semibold truncate ${activeChatId === chat.id ? "text-blue-700" : "text-slate-800"}`}>{receiver.username}</span>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">{lastMsgTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate ${unread > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                        {chat.typing ? <span className="text-violet-500 italic">typing…</span> : (chat.lastMessage || "New chat")}
                      </span>
                      {unread > 0 && <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#f36c3a] text-white text-[10px] font-bold">{unread > 99 ? "99+" : unread}</span>}
                    </div>
                    <span className="text-[10px] font-semibold mt-0.5 inline-block text-slate-400">User</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
              <button onClick={() => setMobileView("list")} className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"><MdArrowBack size={20} /></button>
              <Avatar contact={activeChat.receiver || { username: "FindProperty" }} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{activeChat.receiver?.username || "FindProperty"}</p>
                {activeChat.typing && <p className="text-xs text-violet-500 italic">typing…</p>}
              </div>
              <div className="flex items-center gap-2">
                {selectMode ? (
                  <>
                    <span className="text-xs text-slate-400 mr-1">{selectedMsgIds.length} selected</span>
                    {selectedMsgIds.length > 0 && (
                      <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-500 text-xs font-semibold"><MdDeleteOutline size={15} /> Delete</button>
                    )}
                    <button onClick={() => { setSelectMode(false); setSelectedMsgIds([]); }} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"><MdClose size={18} /></button>
                  </>
                ) : (
                  <button onClick={() => setSelectMode(true)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"><BsThreeDotsVertical size={16} /></button>
                )}
              </div>
            </div>
            <div ref={messagesRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/60 relative">
              {groupMessagesByDate(activeChat.messages || []).map((item, idx) =>
                item.type === "divider" ? <DateDivider key={idx} label={item.label} /> : (
                  <MessageBubble
                    key={item.msg.id}
                    msg={item.msg}
                    onDelete={deleteMessage}
                    selected={selectedMsgIds.includes(item.msg.id)}
                    onSelect={toggleSelect}
                    selectMode={selectMode}
                    isMe={item.msg.userId === currentUserId}
                  />
                )
              )}
              {activeChat.typing && <TypingIndicator />}
              <div ref={bottomRef} />
              {showScrollBtn && <button onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })} className="absolute bottom-4 right-4 w-9 h-9 bg-white border rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-violet-600"><MdKeyboardArrowDown size={20} /></button>}
            </div>
            <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="flex items-end gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-300">
                <textarea
                  rows={1}
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={handleKey}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
                  style={{ minHeight: "24px", maxHeight: "112px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#f36c3a] text-white hover:bg-violet-700 disabled:opacity-40"
                >
                  <MdSend size={16} />
                </button>
              </div>
            </div>
          </>
        ) : <EmptyState />}
      </div>
    </div>
  );
}