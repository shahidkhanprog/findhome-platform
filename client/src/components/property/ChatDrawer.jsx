import React, { useState, useRef, useEffect, useCallback } from "react";
import { HiX } from "react-icons/hi";
import { FaCheck, FaPaperPlane } from "react-icons/fa";
import { formatPKR } from "../../utils/format.js";


const fmtTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDateSep = (d) => {
  const diff = (Date.now() - d) / 1000;
  if (diff < 86400) return "Today";
  if (diff < 172800) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function ChatDrawer({ isOpen, onClose, property }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (property && messages.length === 0) {
      setMessages([
        {
          id: 1,
          from: "agent",
          text: `Hi! 👋 I'm the agent for "${property.title}". Feel free to ask any questions about this property.`,
          ts: new Date(Date.now() - 1000 * 60 * 18),
        },
      ]);
    }
  }, [property, messages.length]);

  const simulateReply = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "agent",
          text: "Thank you for your message! I'll review your query and get back to you shortly.",
          ts: new Date(),
        },
      ]);
    }, 2200);
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text, ts: new Date() }]);
    setDraft("");
    simulateReply();
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 380);
  }, [isOpen]);

  if (!isOpen) return null;

  const grouped = messages.reduce((acc, m) => {
    const key = fmtDateSep(m.ts);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <style>{`
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .drawer-panel { animation: slideInRight .32s cubic-bezier(.22,1,.36,1) both }
        .msg-in { animation: msgIn .22s ease both }
        .typing-dot { animation: blink 1.3s ease-in-out infinite }
      `}</style>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="drawer-panel relative w-full sm:max-w-md bg-[#f0f2f5] h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#f36c3a] p-6 text-white flex justify-between items-center rounded-bl-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/30">👩‍💼</div>
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#f36c3a] animate-pulse" />
            </div>
            <div>
              <p className="font-black text-lg leading-tight">Property Agent</p>
              <p className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Active now
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition"><HiX size={22} /></button>
        </div>

        {/* Property snippet */}
        <div className="bg-[#f36c3a] px-5 pb-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3">
            <img src={property?.images?.[0]} alt="" className="w-11 h-9 rounded-xl object-cover" />
            <div>
              <p className="text-white text-xs font-black line-clamp-1">{property?.title}</p>
              <p className="text-white/70 text-[10px] font-bold mt-0.5">
                {formatPKR(property?.price)} {property?.listingType === "rent" ? "/mo" : ""} · {property?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          {Object.entries(grouped).map(([date, msgs]) => (
            <React.Fragment key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-300/70" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
                <div className="flex-1 h-px bg-slate-300/70" />
              </div>
              {msgs.map((m, idx) => {
                const isUser = m.from === "user";
                const nextSame = idx < msgs.length - 1 && msgs[idx + 1].from === m.from;
                return (
                  <div key={m.id} className={`msg-in flex ${isUser ? "justify-end" : "justify-start"} ${nextSame ? "mb-0.5" : "mb-3"}`}>
                    <div className={`max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed font-medium ${isUser ? "bg-[#f36c3a] text-white rounded-[18px] rounded-br-[5px]" : "bg-white text-slate-800 rounded-[18px] rounded-bl-[5px] border border-slate-100"} shadow-sm`}
                      >
                        {m.text}
                      </div>
                      {!nextSame && (
                        <div className={`flex items-center gap-1 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] text-slate-400 font-semibold">{fmtTime(m.ts)}</span>
                          {isUser && <FaCheck size={9} className="text-green-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          {isTyping && (
            <div className="msg-in flex justify-start mb-3">
              <div className="flex items-center gap-2">
                <div className="px-4 py-3 flex gap-1.5 bg-white rounded-[18px] rounded-bl-[5px] border border-slate-100 shadow-sm">
                  {[0, 1, 2].map((i) => <div key={i} className="typing-dot w-2 h-2 rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.18}s` }} />)}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Agent is typing…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-[1.5rem] border border-slate-200 focus-within:border-[#f36c3a] focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 outline-none text-slate-900 font-bold text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className={`p-3 rounded-2xl transition active:scale-90 ${draft.trim() ? "bg-[#f36c3a] text-white shadow-md shadow-orange-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              <FaPaperPlane size={15} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 font-semibold mt-2">Responses typically within a few minutes</p>
        </div>
      </div>
    </div>
  );
}