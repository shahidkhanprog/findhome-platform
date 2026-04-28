import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MdSearch, MdMoreVert, MdSend, MdDone, MdDoneAll,
  MdArrowBack, MdFilterList, MdEdit, MdClose, MdCheck,
  MdDeleteOutline, MdKeyboardArrowDown,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";
import { SocketContext } from "../../../context/SocketContext";
import { ChatContext } from "../../../context/ChatContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const format12HourTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });

const getDateGroup = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
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

// ─── Sub-components ───────────────────────────────────────────────────────────
const Avatar = ({ contact, size = "md" }) => {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const initials = contact?.username?.slice(0, 2).toUpperCase() || "??";
  return (
    <div className={`relative flex-shrink-0 ${sz[size]}`}>
      <div className={`${sz[size]} rounded-2xl bg-gray-900 flex items-center justify-center font-bold text-white select-none`}>
        {contact?.avatar
          ? <img src={contact.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
          : initials}
      </div>
    </div>
  );
};

const MessageBubble = ({ msg, onDelete, selected, onSelect, selectMode, isMe }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!showActions) return;
    const handler = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target))
        setShowActions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  const timeStr = msg.createdAt ? format12HourTime(msg.createdAt) : msg.time;

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1.5 group`}
      onClick={() => selectMode && onSelect(msg.id)}
    >
      {selectMode && (
        <div className={`flex items-end pb-2 ${isMe ? "order-2 ml-2" : "mr-2"}`}>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${selected ? "bg-[#f36c3a] border-violet-600" : "border-slate-300 bg-white"}`}>
            {selected && <MdCheck size={12} className="text-white" />}
          </div>
        </div>
      )}
      <div className={`relative max-w-[70%] ${selectMode ? "cursor-pointer" : ""}`}>
        {!selectMode && (
          <div
            ref={actionsRef}
            className={`absolute top-1 ${isMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}
          >
            <button
              onClick={() => setShowActions(true)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm"
            >
              <MdMoreVert size={13} />
            </button>
            {showActions && (
              <div className={`absolute top-7 ${isMe ? "right-0" : "left-0"} bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-20 min-w-[140px]`}>
                <button
                  onClick={() => { onDelete(msg.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-rose-500 hover:bg-rose-50"
                >
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
            {isMe && (msg.read
              ? <MdDoneAll size={12} className="text-violet-300" />
              : <MdDone size={12} className="text-violet-400" />)}
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
        <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Messages() {
  const { socket } = useContext(SocketContext);
  const {
    chats,
    setChats,
    markChatRead,
    fetchAndAddChat,
    addMessage,
    replaceMessage,
    removeMessage,
    setTyping,
    fetcher,
    sortByLatest,
    currentUserId,
  } = useContext(ChatContext);

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
  const typingTimeout = useRef(null);

  // ✅ Keep a ref of activeChatId so socket handlers always see latest value
  //    without needing activeChatId in their dependency array (avoids
  //    unsubscribe/resubscribe on every chat switch)
  const activeChatIdRef = useRef(activeChatId);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  const getReceiverId = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.userIDs?.find((id) => String(id) !== String(currentUserId));
  };

  // ─── Single socket handler ────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onReceiveMessage = ({ chatId, message }) => {
      const isFromOther = String(message.userId) !== String(currentUserId);
      const isActive = chatId === activeChatIdRef.current;

      // Pull sender info the server attached (fixes Unknown name/avatar)
      const senderInfo =
        message.senderUsername
          ? { username: message.senderUsername, avatar: message.senderAvatar || null }
          : null;

      setChats((prevChats) => {
        const chatExists = prevChats.find((c) => c.id === chatId);

        if (!chatExists) {
          // Brand-new chat — fetch full details (receiver info, history)
          fetchAndAddChat(chatId, message);
          return prevChats; // state update comes from fetchAndAddChat
        }

        // Duplicate guard
        if (chatExists.messages.some((m) => m.id === message.id)) return prevChats;

        // ✅ Patch receiver inline using senderInfo — no extra API call needed
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
              // ✅ Only increment unread if message is from other user AND chat is not open
              unread: isFromOther && !isActive
                ? (chat.unread || 0) + 1
                : chat.unread,
            };
          })
        );
      });

      // If this chat is currently open, mark it read immediately
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
    // ✅ activeChatId deliberately NOT in deps — we use the ref above
  }, [socket, currentUserId, fetchAndAddChat, markChatRead, setChats, setTyping, sortByLatest]);

  // ─── Send a message ───────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeChatId) return;

    const tempId = `temp_${Date.now()}`;
    const newMsg = {
      id: tempId,
      text,
      createdAt: new Date().toISOString(),
      userId: currentUserId,
      read: false,
      pending: true,
    };

    // Optimistic update
    addMessage(activeChatId, newMsg);
    setInput("");

    try {
      const saved = await fetcher(`/api/messages/${activeChatId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      // Replace temp message with real DB message
      replaceMessage(activeChatId, tempId, saved);
      markChatRead(activeChatId);

      // Notify receiver via socket
      socket?.emit("sendMessage", {
        chatId: activeChatId,
        message: saved,
        receiverId: getReceiverId(activeChatId),
      });
    } catch (err) {
      console.error("Send failed:", err);
      removeMessage(activeChatId, tempId);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!activeChatId || !socket) return;
    const receiverId = getReceiverId(activeChatId);
    socket.emit("typing", { chatId: activeChatId, receiverId });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: activeChatId, receiverId });
    }, 1000);
  };

  // ─── Open / close chat ────────────────────────────────────────────────────
  const openChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileView("chat");
    setSelectMode(false);
    setSelectedMsgIds([]);
    markChatRead(chatId);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ─── Multi-select / delete ────────────────────────────────────────────────
  const deleteSelected = () => {
    selectedMsgIds.forEach((id) => removeMessage(activeChatId, id));
    setSelectMode(false);
    setSelectedMsgIds([]);
  };

  const toggleSelect = (msgId) =>
    setSelectedMsgIds((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    );

  // ─── Filtered chat list ───────────────────────────────────────────────────
  const filteredChats = chats.filter((chat) => {
    const name = chat.receiver?.username || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? (chat.unread || 0) > 0 : true;
    return matchSearch && matchFilter;
  });

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!showScrollBtn) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length, showScrollBtn]);

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  };

  const totalUnread = chats.reduce((sum, c) => sum + (c.unread || 0), 0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-112px)] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">

      {/* ── Sidebar ── */}
      <div className={`flex flex-col w-full md:w-[320px] lg:w-[340px] flex-shrink-0 bg-white border-r border-slate-100 ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}>

        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Messages</h2>
              {totalUnread > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#f36c3a] text-white text-[10px] font-bold">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu((v) => !v)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl ${filter !== "all" ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}
                >
                  <MdFilterList size={18} />
                </button>
                {showFilterMenu && (
                  <div className="absolute top-9 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 min-w-[150px]">
                    {["all", "unread"].map((f) => (
                      <button key={f}
                        onClick={() => { setFilter(f); setShowFilterMenu(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm capitalize ${filter === f ? "text-violet-600 bg-gray-200 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                      >
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {search && <button onClick={() => setSearch("")}><MdClose size={14} /></button>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <MdSearch size={55} className="text-gray-500 opacity-30 mb-3" />
              <p className="text-[18px] font-medium text-slate-500">No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const receiver = chat.receiver || { username: "Unknown" };
              const unread = chat.unread || 0;
              const lastMsgTime = chat.messages?.length
                ? format12HourTime(chat.messages[chat.messages.length - 1].createdAt)
                : "";
              return (
                <button
                  key={chat.id}
                  onClick={() => openChat(chat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-slate-50 border-r-2 border-b border-gray-300 ${activeChatId === chat.id ? "bg-gray-200 border-r-black" : "border-r-transparent"}`}
                >
                  <Avatar contact={receiver} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-semibold truncate ${activeChatId === chat.id ? "text-blue-700" : "text-slate-800"}`}>
                        {receiver.username}
                      </span>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">{lastMsgTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate ${unread > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                        {chat.typing
                          ? <span className="text-violet-500 italic">typing…</span>
                          : (chat.lastMessage || "New chat")}
                      </span>
                      {unread > 0 && (
                        <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#f36c3a] text-white text-[10px] font-bold">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat Panel ── */}
      <div className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
              <button onClick={() => setMobileView("list")} className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
                <MdArrowBack size={20} />
              </button>
              <Avatar contact={activeChat.receiver} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {activeChat.receiver?.username || "User"}
                </p>
                {activeChat.typing && (
                  <p className="text-xs text-violet-500 italic">typing…</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectMode ? (
                  <>
                    <span className="text-xs text-slate-400 mr-1">{selectedMsgIds.length} selected</span>
                    {selectedMsgIds.length > 0 && (
                      <button onClick={deleteSelected}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-500 text-xs font-semibold">
                        <MdDeleteOutline size={15} /> Delete
                      </button>
                    )}
                    <button onClick={() => { setSelectMode(false); setSelectedMsgIds([]); }}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                      <MdClose size={18} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectMode(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                    <BsThreeDotsVertical size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/60 relative"
            >
              {groupMessagesByDate(activeChat.messages || []).map((item, idx) =>
                item.type === "divider"
                  ? <DateDivider key={`div-${idx}`} label={item.label} />
                  : (
                    <MessageBubble
                      key={item.msg.id}
                      msg={item.msg}
                      onDelete={(id) => removeMessage(activeChatId, id)}
                      selected={selectedMsgIds.includes(item.msg.id)}
                      onSelect={toggleSelect}
                      selectMode={selectMode}
                      isMe={String(item.msg.userId) === String(currentUserId)}
                    />
                  )
              )}
              {activeChat.typing && <TypingIndicator />}
              <div ref={bottomRef} />
              {showScrollBtn && (
                <button
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute bottom-4 right-4 w-9 h-9 bg-white border rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-violet-600"
                >
                  <MdKeyboardArrowDown size={20} />
                </button>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="flex items-end gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-300">
                <textarea
                  rows={1}
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={handleKey}
                  placeholder="Type a message…"
                  ref={inputRef}
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
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-slate-50/40">
            <div className="w-20 h-20 rounded-3xl bg-gray-200 flex items-center justify-center mb-5">
              <svg className="w-9 h-9 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="text-slate-700 font-semibold text-base mb-1.5">Select a conversation</p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">Choose a contact from the list to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}