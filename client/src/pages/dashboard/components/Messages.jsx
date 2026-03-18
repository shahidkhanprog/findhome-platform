// function Messages() {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//       <div className="text-6xl mb-4 opacity-20">✉</div>
//       <p className="text-sm font-medium">No messages yet</p>
//       <p className="text-xs mt-1 opacity-70">Conversations with buyers and sellers will show here</p>
//     </div>
//   );
// }

// export default Messages;


import { useState, useRef, useEffect } from "react";
import {
  MdSearch, MdMoreVert, MdSend, MdAttachFile, MdEmojiEmotions,
  MdDone, MdDoneAll, MdCircle, MdArrowBack, MdFilterList, MdEdit,
  MdClose, MdCheck, MdDeleteOutline, MdOutlineMarkChatRead,
  MdInsertDriveFile, MdKeyboardArrowDown, MdImage, MdDescription,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

// ─────────────────────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────────────────────
const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤔","😅","🙏","👍","❤️",
  "🔥","✅","🎉","💯","👀","😭","🤣","😊","💪","🙌",
  "😢","😤","🤯","🥳","😴","🤗","💀","😏","🫡","🤝",
  "👋","✨","💬","📦","🏠","💰","📋","🗓️","💼","🔑",
];

const INITIAL_CONTACTS = [
  {
    id: 1, name: "Sarah Mitchell", role: "Buyer", initials: "SM",
    color: "from-violet-400 to-purple-500", online: true, typing: false,
    lastMsg: "Is the listing still available?", time: "2m", unread: 3,
    messages: [
      { id: 1, from: "them", text: "Hi! I saw your listing for the downtown apartment.", time: "10:14 AM", read: true, type: "text" },
      { id: 2, from: "me",   text: "Yes, it's still available! Would you like to schedule a viewing?", time: "10:16 AM", read: true, type: "text" },
      { id: 3, from: "them", text: "That would be great. What times work for you this week?", time: "10:18 AM", read: true, type: "text" },
      { id: 4, from: "me",   text: "I'm free Tuesday or Thursday afternoon, around 3–5 PM.", time: "10:20 AM", read: true, type: "text" },
      { id: 5, from: "them", text: "Thursday works perfectly for me!", time: "10:21 AM", read: true, type: "text" },
      { id: 6, from: "them", text: "Is the listing still available?", time: "Just now", read: false, type: "text" },
    ],
  },
  {
    id: 2, name: "James Okafor", role: "Seller", initials: "JO",
    color: "from-emerald-400 to-teal-500", online: true, typing: false,
    lastMsg: "I can do $420,000 final price.", time: "18m", unread: 1,
    messages: [
      { id: 1, from: "them", text: "Hello, I'm interested in making an offer on the Westside property.", time: "9:30 AM", read: true, type: "text" },
      { id: 2, from: "me",   text: "Great to hear! The asking price is $435,000.", time: "9:45 AM", read: true, type: "text" },
      { id: 3, from: "them", text: "I can do $420,000 final price.", time: "9:50 AM", read: false, type: "text" },
    ],
  },
  {
    id: 3, name: "Priya Sharma", role: "Buyer", initials: "PS",
    color: "from-rose-400 to-pink-500", online: false, typing: false,
    lastMsg: "Thanks for sending the docs!", time: "1h", unread: 0,
    messages: [
      { id: 1, from: "me",   text: "Hi Priya, I've sent over the property documents for your review.", time: "8:00 AM", read: true, type: "text" },
      { id: 2, from: "them", text: "Thanks for sending the docs!", time: "8:15 AM", read: true, type: "text" },
    ],
  },
  {
    id: 4, name: "Daniel Cruz", role: "Seller", initials: "DC",
    color: "from-amber-400 to-orange-500", online: false, typing: false,
    lastMsg: "Let me check with my agent.", time: "3h", unread: 0,
    messages: [
      { id: 1, from: "them", text: "Can we move the closing date to next Friday?", time: "Yesterday", read: true, type: "text" },
      { id: 2, from: "me",   text: "I'll need to confirm with the lender first.", time: "Yesterday", read: true, type: "text" },
      { id: 3, from: "them", text: "Let me check with my agent.", time: "Yesterday", read: true, type: "text" },
    ],
  },
  {
    id: 5, name: "Aisha Nwosu", role: "Buyer", initials: "AN",
    color: "from-sky-400 to-blue-500", online: true, typing: false,
    lastMsg: "Perfect, see you then!", time: "Yesterday", unread: 0,
    messages: [
      { id: 1, from: "them", text: "Are you available for a call tomorrow at noon?", time: "Yesterday", read: true, type: "text" },
      { id: 2, from: "me",   text: "Yes, noon works great for me.", time: "Yesterday", read: true, type: "text" },
      { id: 3, from: "them", text: "Perfect, see you then!", time: "Yesterday", read: true, type: "text" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtSize = (b) => {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
};

// ─────────────────────────────────────────────────────────────────────────────
//  Avatar
// ─────────────────────────────────────────────────────────────────────────────
const Avatar = ({ contact, size = "md" }) => {
  const sz  = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const dot = { sm: "w-2 h-2 border",  md: "w-2.5 h-2.5 border-2", lg: "w-3 h-3 border-2" };
  return (
    <div className={`relative flex-shrink-0 ${sz[size]}`}>
      <div className={`${sz[size]} rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center font-bold text-white select-none`}>
        {contact.initials}
      </div>
      {contact.online && (
        <span className={`absolute bottom-0 right-0 ${dot[size]} bg-emerald-400 rounded-full border-white`} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Attachment Preview Modal  (WhatsApp-style)
// ─────────────────────────────────────────────────────────────────────────────
const AttachmentPreview = ({ attachment, caption, onCaptionChange, onSend, onCancel }) => {
  const isImage = attachment.type === "image";

  return (
    /* Full-screen dark overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      {/* Modal card */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
              {isImage
                ? <MdImage size={18} className="text-violet-500" />
                : <MdDescription size={18} className="text-violet-500" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {isImage ? "Send Image" : "Send File"}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{attachment.name}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* ── Preview area ── */}
        <div className="bg-slate-50 flex items-center justify-center min-h-[260px] max-h-[340px] overflow-hidden px-5 py-5">
          {isImage ? (
            <img
              src={attachment.previewUrl}
              alt="preview"
              className="max-h-[300px] max-w-full rounded-xl object-contain shadow-md"
            />
          ) : (
            /* File preview card */
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

        {/* ── Caption input ── */}
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 h-10 focus-within:border-violet-300 focus-within:bg-white transition-all">
            <input
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
              placeholder="Add a caption… (optional)"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="flex-1 h-10 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-violet-200"
          >
            <MdSend size={15} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Message Bubble
// ─────────────────────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, onDelete, selected, onSelect, selectMode }) => {
  const isMe = msg.from === "me";
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!showActions) return;
    const handler = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActions(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [showActions]);

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1.5 group`}
      onClick={() => selectMode && onSelect(msg.id)}
    >
      {/* Select checkbox */}
      {selectMode && (
        <div className={`flex items-end pb-2 ${isMe ? "order-2 ml-2" : "mr-2"}`}>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
            ${selected ? "bg-violet-600 border-violet-600" : "border-slate-300 bg-white"}`}>
            {selected && <MdCheck size={12} className="text-white" />}
          </div>
        </div>
      )}

      <div className={`relative max-w-[70%] ${selectMode ? "cursor-pointer" : ""}`}>

        {/* Hover delete action */}
        {!selectMode && (
          <div
            ref={actionsRef}
            className={`absolute top-1 ${isMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}
          >
            <button
              onClick={() => setShowActions((v) => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm"
            >
              <MdMoreVert size={13} />
            </button>
            {showActions && (
              <div className={`absolute top-7 ${isMe ? "right-0" : "left-0"} bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-20 min-w-[140px]`}>
                <button
                  onClick={() => { onDelete(msg.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <MdDeleteOutline size={14} /> Delete message
                </button>
              </div>
            )}
          </div>
        )}

        {/* Image bubble */}
        {msg.type === "image" ? (
          <div className={`rounded-2xl overflow-hidden border ${isMe ? "border-violet-200 rounded-br-sm" : "border-slate-100 rounded-bl-sm shadow-sm"}`}>
            <img src={msg.url} alt="attachment" className="max-w-[220px] block" />
            {msg.caption && (
              <div className={`px-3 pt-1.5 text-xs ${isMe ? "bg-violet-600 text-violet-100" : "bg-white text-slate-600"}`}>
                {msg.caption}
              </div>
            )}
            <div className={`px-3 py-1.5 flex items-center justify-end gap-1 ${isMe ? "bg-violet-600" : "bg-white"}`}>
              <span className={`text-[10px] ${isMe ? "text-violet-300" : "text-slate-400"}`}>{msg.time}</span>
              {isMe && (msg.read
                ? <MdDoneAll size={12} className="text-violet-300" />
                : <MdDone size={12} className="text-violet-400" />)}
            </div>
          </div>

        /* File bubble */
        ) : msg.type === "file" ? (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border
            ${isMe ? "bg-violet-600 border-violet-500 rounded-br-sm" : "bg-white border-slate-100 rounded-bl-sm shadow-sm"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isMe ? "bg-violet-500" : "bg-slate-100"}`}>
              <MdInsertDriveFile size={18} className={isMe ? "text-violet-200" : "text-slate-500"} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold truncate max-w-[140px] ${isMe ? "text-white" : "text-slate-700"}`}>
                {msg.fileName}
              </p>
              {msg.caption && (
                <p className={`text-[11px] mt-0.5 ${isMe ? "text-violet-200" : "text-slate-500"}`}>{msg.caption}</p>
              )}
              <p className={`text-[10px] mt-0.5 ${isMe ? "text-violet-300" : "text-slate-400"}`}>
                {msg.fileSize} · {msg.time}
              </p>
            </div>
          </div>

        /* Text bubble */
        ) : (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isMe ? "bg-violet-600 text-white rounded-br-sm" : "bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100"}`}>
            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <span className={`text-[10px] ${isMe ? "text-violet-300" : "text-slate-400"}`}>{msg.time}</span>
              {isMe && (msg.read
                ? <MdDoneAll size={12} className="text-violet-300" />
                : <MdDone size={12} className="text-violet-400" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Typing Indicator
// ─────────────────────────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start mb-2">
    <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
        />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Date Divider
// ─────────────────────────────────────────────────────────────────────────────
const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[11px] font-medium text-slate-400 px-2">{label}</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Smart date-group label from a message's time string
//  Handles: "Just now", "2m", "18m", "1h", "3h", "Yesterday", "10:14 AM", etc.
// ─────────────────────────────────────────────────────────────────────────────
const getDateGroup = (timeStr) => {
  if (!timeStr) return "Today";
  const t = timeStr.trim().toLowerCase();
  // Explicit "yesterday" label
  if (t === "yesterday") return "Yesterday";
  // Relative time labels that imply today
  if (
    t === "just now" ||
    /^\d+m$/.test(t) ||   // e.g. "2m", "18m"
    /^\d+h$/.test(t) ||   // e.g. "1h", "3h"
    /^\d{1,2}:\d{2}\s?(am|pm)$/i.test(t) // e.g. "10:14 AM", "9:30 AM"
  ) return "Today";
  // Anything else (e.g. a full date string) — return as-is
  return timeStr;
};

// Build a list of { divider?, msg } items with dividers injected per group
const groupMessagesByDate = (messages) => {
  const items = [];
  let lastGroup = null;
  messages.forEach((msg) => {
    const group = getDateGroup(msg.time);
    if (group !== lastGroup) {
      items.push({ type: "divider", label: group });
      lastGroup = group;
    }
    items.push({ type: "msg", msg });
  });
  return items;
};

// ─────────────────────────────────────────────────────────────────────────────
//  Emoji Picker
// ─────────────────────────────────────────────────────────────────────────────
const EmojiPicker = ({ onSelect, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  return (
    <div ref={ref} className="absolute bottom-[72px] right-4 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-[260px]">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-semibold text-slate-500">Emoji</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <MdClose size={15} />
        </button>
      </div>
      <div className="grid grid-cols-8 gap-0.5">
        {EMOJIS.map((em) => (
          <button
            key={em}
            onClick={() => { onSelect(em); onClose(); }}
            className="text-lg h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Contact Context Menu  (right-click)
// ─────────────────────────────────────────────────────────────────────────────
const ContactMenu = ({ x, y, onMarkRead, onDelete, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[170px]"
    >
      <button
        onClick={onMarkRead}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <MdOutlineMarkChatRead size={16} className="text-violet-500" /> Mark as read
      </button>
      <div className="my-1 border-t border-slate-100" />
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
      >
        <MdDeleteOutline size={16} /> Delete chat
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Scroll-to-bottom Button
// ─────────────────────────────────────────────────────────────────────────────
const ScrollToBottomBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-4 right-4 w-9 h-9 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-all z-10"
  >
    <MdKeyboardArrowDown size={20} />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Messages  (main component)
// ─────────────────────────────────────────────────────────────────────────────
function Messages() {
  const [contacts, setContacts]             = useState(INITIAL_CONTACTS);
  const [activeId, setActiveId]             = useState(null);
  const [input, setInput]                   = useState("");
  const [search, setSearch]                 = useState("");
  const [mobileView, setMobileView]         = useState("list");
  const [showEmoji, setShowEmoji]           = useState(false);
  const [selectMode, setSelectMode]         = useState(false);
  const [selectedMsgs, setSelectedMsgs]     = useState([]);
  const [contextMenu, setContextMenu]       = useState(null);
  const [showScrollBtn, setShowScrollBtn]   = useState(false);
  const [filter, setFilter]                 = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // ── Attachment preview state ──────────────────────────────────────────────
  const [attachPreview, setAttachPreview]   = useState(null); // { file, type, name, size, ext, previewUrl }
  const [attachCaption, setAttachCaption]   = useState("");

  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const messagesRef  = useRef(null);
  const fileInputRef = useRef(null);
  const filterRef    = useRef(null);

  const active = contacts.find((c) => c.id === activeId);

  // ── Close filter menu on outside click ───────────────────────────────────
  useEffect(() => {
    if (!showFilterMenu) return;
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterMenu(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [showFilterMenu]);

  // ── Filtered contact list ─────────────────────────────────────────────────
  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "unread"  ? c.unread > 0       :
      filter === "buyers"  ? c.role === "Buyer"  :
      filter === "sellers" ? c.role === "Seller" : true;
    return matchSearch && matchFilter;
  });

  // ── Auto scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showScrollBtn) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length, activeId]);

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  };

  // ── Simulate typing indicator from other side ─────────────────────────────
  const simulateTyping = (contactId) => {
    setContacts((prev) => prev.map((c) => c.id === contactId ? { ...c, typing: true } : c));
    setTimeout(() => {
      setContacts((prev) => prev.map((c) => c.id === contactId ? { ...c, typing: false } : c));
    }, 1800 + Math.random() * 1200);
  };

  // ── Open conversation ─────────────────────────────────────────────────────
  const openChat = (id) => {
    setActiveId(id);
    setMobileView("chat");
    setSelectMode(false);
    setSelectedMsgs([]);
    setShowEmoji(false);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
    // Only auto-focus on desktop — prevents keyboard popping up on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Send text ─────────────────────────────────────────────────────────────
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeId) return;
    const msg = { id: Date.now(), from: "me", text, time: getNow(), read: false, type: "text" };
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, msg], lastMsg: text, time: "Just now" }
          : c
      )
    );
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    simulateTyping(activeId);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── File selected → open preview modal (DO NOT send yet) ─────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !activeId) return;
    const isImage = file.type.startsWith("image/");
    const ext = file.name.split(".").pop() || "";
    setAttachPreview({
      file,
      type: isImage ? "image" : "file",
      name: file.name,
      size: fmtSize(file.size),
      ext,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    });
    setAttachCaption("");
    e.target.value = ""; // reset input so same file can be re-selected
  };

  // ── Confirm send from preview modal ──────────────────────────────────────
  const confirmAttachment = () => {
    if (!attachPreview || !activeId) return;
    const { type, name, size, previewUrl } = attachPreview;
    const msg =
      type === "image"
        ? { id: Date.now(), from: "me", type: "image", url: previewUrl, caption: attachCaption, time: getNow(), read: false }
        : { id: Date.now(), from: "me", type: "file", fileName: name, fileSize: size, caption: attachCaption, time: getNow(), read: false };
    const preview = type === "image" ? "📷 Image" : `📄 ${name}`;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, msg], lastMsg: preview, time: "Just now" }
          : c
      )
    );
    setAttachPreview(null);
    setAttachCaption("");
    simulateTyping(activeId);
  };

  // ── Cancel attachment preview ─────────────────────────────────────────────
  const cancelAttachment = () => {
    if (attachPreview?.previewUrl) URL.revokeObjectURL(attachPreview.previewUrl);
    setAttachPreview(null);
    setAttachCaption("");
  };

  // ── Delete message ────────────────────────────────────────────────────────
  const deleteMessage = (msgId) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) }
          : c
      )
    );
  };

  const deleteSelected = () => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: c.messages.filter((m) => !selectedMsgs.includes(m.id)) }
          : c
      )
    );
    setSelectMode(false);
    setSelectedMsgs([]);
  };

  const toggleSelect = (msgId) => {
    setSelectedMsgs((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    );
  };

  // ── Contact context menu ──────────────────────────────────────────────────
  const handleContextMenu = (e, contactId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, contactId });
  };

  const markContactRead = (contactId) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
    setContextMenu(null);
  };

  const deleteContact = (contactId) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    if (activeId === contactId) setActiveId(null);
    setContextMenu(null);
  };

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  // ── Empty state ───────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-slate-50/40">
      <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mb-5">
        <svg className="w-9 h-9 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </div>
      <p className="text-slate-700 font-semibold text-base mb-1.5">Select a conversation</p>
      <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">
        Choose a contact from the list to start messaging
      </p>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Attachment preview modal ── */}
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

        {/* ══════════════════════════════════════════
            Contact List
        ══════════════════════════════════════════ */}
        <div className={`flex flex-col w-full md:w-[320px] lg:w-[340px] flex-shrink-0 bg-white border-r border-slate-100 ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}>

          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Messages</h2>
                {totalUnread > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-violet-600 text-white text-[10px] font-bold leading-none">
                    {totalUnread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <div ref={filterRef} className="relative">
                  <button
                    onClick={() => setShowFilterMenu((v) => !v)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all
                      ${filter !== "all" ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                  >
                    <MdFilterList size={18} />
                  </button>
                  {showFilterMenu && (
                    <div className="absolute top-9 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 min-w-[150px]">
                      {["all", "unread", "buyers", "sellers"].map((f) => (
                        <button
                          key={f}
                          onClick={() => { setFilter(f); setShowFilterMenu(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm capitalize transition-colors
                            ${filter === f ? "text-violet-600 bg-violet-50 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          {f} {filter === f && <MdCheck size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                  <MdEdit size={18} />
                </button>
              </div>
            </div>

            {/* Active filter chip */}
            {filter !== "all" && (
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {filter}
                  <button onClick={() => setFilter("all")} className="hover:text-violet-900">
                    <MdClose size={12} />
                  </button>
                </span>
              </div>
            )}

            {/* Search */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-9 focus-within:border-violet-300 focus-within:bg-white transition-all">
              <MdSearch size={16} className="text-slate-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                  <MdClose size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Contact rows */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-3xl mb-3 opacity-30">🔍</div>
                <p className="text-sm font-medium text-slate-500">No conversations found</p>
                <p className="text-xs text-slate-400 mt-1">Try a different search or filter</p>
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openChat(c.id)}
                  onContextMenu={(e) => handleContextMenu(e, c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-slate-50 border-r-2
                    ${activeId === c.id ? "bg-violet-50 border-r-violet-500" : "border-r-transparent"}`}
                >
                  <Avatar contact={c} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-semibold truncate ${activeId === c.id ? "text-violet-700" : "text-slate-800"}`}>
                        {c.name}
                      </span>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate ${c.unread > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                        {c.typing
                          ? <span className="text-violet-500 font-medium italic">typing…</span>
                          : c.lastMsg}
                      </span>
                      {c.unread > 0 && (
                        <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-violet-600 text-white text-[10px] font-bold leading-none">
                          {c.unread > 99 ? "99+" : c.unread}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold mt-0.5 inline-block ${c.role === "Buyer" ? "text-sky-500" : "text-emerald-500"}`}>
                      {c.role}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            Chat Panel
        ══════════════════════════════════════════ */}
        <div className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
          {active ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setMobileView("list")}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all -ml-1"
                >
                  <MdArrowBack size={20} />
                </button>

                <Avatar contact={active} size="md" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{active.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    {active.typing ? (
                      <span className="text-violet-500 font-medium italic">typing…</span>
                    ) : active.online ? (
                      <><MdCircle size={8} className="text-emerald-400" /> Online</>
                    ) : "Offline"}
                    {!active.typing && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className={`font-semibold ${active.role === "Buyer" ? "text-sky-500" : "text-emerald-500"}`}>
                          {active.role}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* Header actions — select only */}
                <div className="flex items-center gap-2">
                  {selectMode ? (
                    <>
                      <span className="text-xs text-slate-400 mr-1">{selectedMsgs.length} selected</span>
                      {selectedMsgs.length > 0 && (
                        <button
                          onClick={deleteSelected}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-500 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          <MdDeleteOutline size={15} /> Delete
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectMode(false); setSelectedMsgs([]); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-all"
                      >
                        <MdClose size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectMode(true)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                      <BsThreeDotsVertical size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Message feed */}
              <div
                ref={messagesRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-50/60 relative"
              >
                {groupMessagesByDate(active.messages).map((item, idx) =>
                  item.type === "divider" ? (
                    <DateDivider key={`divider-${idx}`} label={item.label} />
                  ) : (
                    <MessageBubble
                      key={item.msg.id}
                      msg={item.msg}
                      onDelete={deleteMessage}
                      selected={selectedMsgs.includes(item.msg.id)}
                      onSelect={toggleSelect}
                      selectMode={selectMode}
                    />
                  )
                )}
                {active.typing && <TypingIndicator />}
                <div ref={bottomRef} />
                {showScrollBtn && <ScrollToBottomBtn onClick={() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); setShowScrollBtn(false); }} />}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex-shrink-0 relative">
                {showEmoji && (
                  <EmojiPicker
                    onSelect={(em) => { setInput((v) => v + em); }}
                    onClose={() => setShowEmoji(false)}
                  />
                )}

                {/* Hidden file input — triggers preview modal, NOT direct send */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex items-end gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-300 focus-within:bg-white transition-all">

                  {/* Attach → opens preview modal */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 mb-0.5 text-slate-400 hover:text-violet-500 transition-colors"
                    title="Attach image or file"
                  >
                    <MdAttachFile size={19} />
                  </button>

                  {/* Textarea */}
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
                    }}
                    onKeyDown={handleKey}
                    placeholder="Type a message…"
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none resize-none leading-relaxed [scrollbar-width:none]"
                    style={{ minHeight: "24px", maxHeight: "112px" }}
                  />

                  {/* Emoji */}
                  <button
                    onClick={() => setShowEmoji((v) => !v)}
                    className={`flex-shrink-0 mb-0.5 transition-colors ${showEmoji ? "text-violet-500" : "text-slate-400 hover:text-violet-500"}`}
                    title="Emoji"
                  >
                    <MdEmojiEmotions size={19} />
                  </button>

                  {/* Send */}
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-violet-200"
                    title="Send (Enter)"
                  >
                    <MdSend size={16} />
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-300 mt-2 select-none">
                  Press <span className="font-semibold">Enter</span> to send ·{" "}
                  <span className="font-semibold">Shift+Enter</span> for new line
                </p>
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Right-click context menu */}
        {contextMenu && (
          <ContactMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onMarkRead={() => markContactRead(contextMenu.contactId)}
            onDelete={() => deleteContact(contextMenu.contactId)}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </>
  );
}

export default Messages;