import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  MdSearch, MdMoreVert, MdSend, MdAttachFile, MdEmojiEmotions,
  MdDone, MdDoneAll, MdCircle, MdArrowBack, MdFilterList, MdEdit,
  MdClose, MdCheck, MdDeleteOutline, MdOutlineMarkChatRead,
  MdInsertDriveFile, MdKeyboardArrowDown, MdImage, MdDescription,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";
import { SocketContext } from "../../../context/SocketContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ---------- Helpers ----------
const getNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

// ------------------------------------------------------------------
//  Avatar Component (uses real username / avatar)
// ------------------------------------------------------------------
const Avatar = ({ contact, size = "md" }) => {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const dot = { sm: "w-2 h-2 border", md: "w-2.5 h-2.5 border-2", lg: "w-3 h-3 border-3" };
  const initials = contact?.username?.slice(0, 2).toUpperCase() || "??";
  const color = "from-violet-400 to-purple-500"; // fallback gradient
  return (
    <div className={`relative flex-shrink-0 ${sz[size]}`}>
      <div className={`${sz[size]} rounded-2xl bg-gray-900 flex items-center justify-center font-bold text-white select-none`}>
        {contact?.avatar ? (
          <img src={contact.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          initials
        )}
      </div>
      {contact?.online && (
        <span className={`absolute bottom-0 right-0 ${dot[size]} bg-emerald-400 rounded-full border-white`} />
      )}
    </div>
  );
};

// ------------------------------------------------------------------
//  Attachment Preview Modal (unchanged)
// ------------------------------------------------------------------
const AttachmentPreview = ({ attachment, caption, onCaptionChange, onSend, onCancel }) => {
  const isImage = attachment.type === "image";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center">
              {isImage ? <MdImage size={18} className="text-violet-500" /> : <MdDescription size={18} className="text-violet-500" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{isImage ? "Send Image" : "Send File"}</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{attachment.name}</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
            <MdClose size={18} />
          </button>
        </div>
        <div className="bg-slate-50 flex items-center justify-center min-h-[260px] max-h-[340px] overflow-hidden px-5 py-5">
          {isImage ? (
            <img src={attachment.previewUrl} alt="preview" className="max-h-[300px] max-w-full rounded-xl object-contain shadow-md" />
          ) : (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                <MdInsertDriveFile size={38} className="text-violet-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 max-w-[260px] truncate">{attachment.name}</p>
                <p className="text-xs text-slate-400 mt-1">{attachment.size} · {attachment.ext.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 h-10 focus-within:border-violet-300">
            <input
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Add a caption… (optional)"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 pb-5">
          <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
          <button onClick={onSend} className="flex-1 h-10 rounded-xl bg-[#f36c3a] text-white text-sm font-semibold hover:bg-violet-700 flex items-center justify-center gap-2"> <MdSend size={15} /> Send</button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
//  Message Bubble (real data)
// ------------------------------------------------------------------
const MessageBubble = ({ msg, onDelete, selected, onSelect, selectMode, isMe }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!showActions) return;
    const handler = (e) => { if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActions(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  const timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : msg.time;

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

// ------------------------------------------------------------------
//  MAIN COMPONENT
// ------------------------------------------------------------------
export default function Messages() {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [chats, setChats] = useState([]);          // { id, userIDs, lastMessage, seenBy, receiver, messages, typing, online? }
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [attachPreview, setAttachPreview] = useState(null);
  const [attachCaption, setAttachCaption] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const filterRef = useRef(null);
  const currentUserId = currentUser?.id ||currentUser.userData.id;

  // ---------- Helper fetcher ----------
  const fetcher = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

const loadChats = useCallback(async () => {
  if (!currentUserId) {
    console.warn("⚠️ loadChats: no currentUserId");
    return;
  }
  try {
    console.log("📡 Fetching /api/chats...");
    const data = await fetcher("/api/chats");
    console.log("✅ API response:", data);
    setChats(data.map(chat => ({
      ...chat,
      messages: chat.messages || [],
      typing: false,
      online: false,
      unread: chat.seenBy?.includes(currentUserId) ? 0 : (chat.messages?.length || 0)
    })));
  } catch (err) {
    console.error("❌ loadChats error:", err);
  }
}, [currentUserId]);

  useEffect(() => { loadChats(); }, [loadChats]);

  // ---------- Real-time socket events ----------
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", ({ chatId, message }) => {
      setChats(prev => prev.map(chat => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.text,
          unread: chat.id === activeChatId ? 0 : (chat.unread || 0) + 1
        };
      }));
      if (activeChatId === chatId) {
        // mark as read automatically
        fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
      }
    });
    socket.on("typing", ({ chatId, userId }) => {
      if (userId === currentUserId) return;
      setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, typing: true } : chat));
      setTimeout(() => {
        setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, typing: false } : chat));
      }, 2000);
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [socket, activeChatId, currentUserId]);

  // ---------- Send message ----------
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeChatId) return;
    const tempId = Date.now();
    const newMsg = { id: tempId, text, createdAt: new Date(), userId: currentUserId, read: false, pending: true };
    // optimistic update
    setChats(prev => prev.map(chat => chat.id === activeChatId ? {
      ...chat,
      messages: [...chat.messages, newMsg],
      lastMessage: text,
    } : chat));
    setInput("");
    try {
      const saved = await fetcher(`/api/messages/${activeChatId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      // replace temp message with real one
      setChats(prev => prev.map(chat => chat.id === activeChatId ? {
        ...chat,
        messages: chat.messages.map(m => m.id === tempId ? { ...saved, pending: false } : m)
      } : chat));
      socket?.emit("sendMessage", { chatId: activeChatId, message: saved, receiverId: getReceiverId(activeChatId) });
    } catch (err) {
      console.error("Send failed", err);
      setChats(prev => prev.map(chat => chat.id === activeChatId ? {
        ...chat,
        messages: chat.messages.filter(m => m.id !== tempId)
      } : chat));
    }
  };

  const getReceiverId = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.userIDs?.find(id => id !== currentUserId);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  // ---------- Typing indicator (emit) ----------
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

  // ---------- Delete message (frontend only for now) ----------
  const deleteMessage = async (msgId) => {
    setChats(prev => prev.map(chat => chat.id === activeChatId ? {
      ...chat,
      messages: chat.messages.filter(m => m.id !== msgId)
    } : chat));
  };

  // ---------- Other UI handlers ----------
  const openChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileView("chat");
    setSelectMode(false);
    setSelectedMsgIds([]);
    setShowEmoji(false);
    // mark chat as read
    fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteSelected = () => {
    setChats(prev => prev.map(chat => chat.id === activeChatId ? {
      ...chat,
      messages: chat.messages.filter(m => !selectedMsgIds.includes(m.id))
    } : chat));
    setSelectMode(false);
    setSelectedMsgIds([]);
  };

  const toggleSelect = (msgId) => {
    setSelectedMsgIds(prev => prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]);
  };

  const markContactRead = (chatId) => {
    fetcher(`/api/chats/read/${chatId}`, { method: "PUT" }).catch(console.warn);
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  };

  const deleteContact = async (chatId) => {
    // optional: call delete endpoint if exists
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  // ---------- Filtered chats ----------
  const filteredChats = chats.filter(chat => {
    const receiver = chat.receiver || {};
    const name = receiver.username || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? chat.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const activeChat = chats.find(c => c.id === activeChatId);
  const isOnline = activeChat?.receiver?.online; // could be set via socket presence

  // Auto-scroll
  useEffect(() => {
    if (!showScrollBtn) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  };

  const attachFile = () => fileInputRef.current?.click();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setAttachPreview({
      file,
      type: isImage ? "image" : "file",
      name: file.name,
      size: fmtSize(file.size),
      ext: file.name.split(".").pop(),
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    });
    e.target.value = "";
  };
  const confirmAttachment = () => {
    // For now, just send a text placeholder (extend to upload file)
    if (attachPreview) {
      sendMessageWithFile(attachPreview, attachCaption);
    }
    setAttachPreview(null);
    setAttachCaption("");
  };
  const sendMessageWithFile = async (attachment, caption) => {
    // TODO: implement file upload to server, then send message with URL
    console.log("File attachment not implemented in backend yet");
  };
  const cancelAttachment = () => {
    if (attachPreview?.previewUrl) URL.revokeObjectURL(attachPreview.previewUrl);
    setAttachPreview(null);
    setAttachCaption("");
  };
  console.log("🔍 currentUser:", currentUser);
console.log("🔍 currentUserId:", currentUserId);

  // Empty state component
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
    <>
      {attachPreview && (
        <AttachmentPreview
          attachment={attachPreview}
          caption={attachCaption}
          onCaptionChange={setAttachCaption}
          onSend={confirmAttachment}
          onCancel={cancelAttachment}
        />
      )}
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
                return (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
                    onContextMenu={(e) => { e.preventDefault(); /* optional context menu */ }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-slate-50 border-r-2 ${activeChatId === chat.id ? "bg-gray-200 border-r-black" : "border-r-transparent"}`}
                  >
                    <Avatar contact={receiver} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-semibold truncate ${activeChatId === chat.id ? "text-blue-700" : "text-slate-800"}`}>{receiver.username}</span>
                        <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
  {chat.messages?.length ? new Date(chat.messages[chat.messages.length-1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : ""}
</span>
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
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    {activeChat.typing ? <span className="text-violet-500 italic">typing…</span> : (isOnline ? <><MdCircle size={8} className="text-emerald-400" /> Online</> : "Offline")}
                  </p>
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
              <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex-shrink-0 relative">
                {showEmoji && (
                  <div className="absolute bottom-[72px] right-4 z-30 bg-white border rounded-2xl shadow-xl p-3 w-[260px]">
                    <div className="grid grid-cols-8 gap-0.5">
                      {["😀","😂","😍","🥰","😎","🤔","😅","🙏"].map(em => (
                        <button key={em} onClick={() => { setInput(v => v + em); setShowEmoji(false); }} className="text-lg h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100">{em}</button>
                      ))}
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc" />
                <div className="flex items-end gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-300">
                  <button onClick={attachFile} className="flex-shrink-0 mb-0.5 text-slate-400 hover:text-violet-500"><MdAttachFile size={19} /></button>
                  <textarea rows={1} value={input} onChange={handleTyping} onKeyDown={handleKey} placeholder="Type a message…" className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed" style={{ minHeight: "24px", maxHeight: "112px" }} />
                  <button onClick={() => setShowEmoji(v => !v)} className={`flex-shrink-0 mb-0.5 ${showEmoji ? "text-violet-500" : "text-slate-400 hover:text-violet-500"}`}><MdEmojiEmotions size={19} /></button>
                  <button onClick={sendMessage} disabled={!input.trim()} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#f36c3a] text-white hover:bg-violet-700 disabled:opacity-40"><MdSend size={16} /></button>
                </div>
              </div>
            </>
          ) : <EmptyState />}
        </div>
      </div>
    </>
  );
}