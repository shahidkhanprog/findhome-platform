import { useState, useEffect, useCallback } from "react";
import { HiX } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImageCarouselModal({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const len = images.length;
  const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 bg-black/95 animate-fadeIn" onClick={onClose}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cSlide { from{opacity:.3;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .carousel-img { animation: cSlide .3s ease both }
      `}</style>

      <button onClick={onClose} className="absolute top-5 right-5 p-3 rounded-full text-white hover:bg-white/20 transition bg-white/10 border border-white/15">
        <HiX size={22} />
      </button>

      <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
        {current + 1} / {len}
      </p>

      <div className="relative w-full max-w-[980px] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <img
          key={current}
          src={images[current]}
          alt={`Photo ${current + 1}`}
          className="carousel-img w-full object-cover max-h-[70vh]"
        />
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80">
          <FaChevronLeft size={14} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80">
          <FaChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-2.5 mt-5 overflow-x-auto max-w-[980px] px-4 scrollbar-hide" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => setCurrent(i)}
            alt="thumbnail"
            className={`flex-shrink-0 w-[72px] h-[52px] rounded-lg object-cover cursor-pointer transition-all duration-200
              ${i === current ? "border-2.5 border-[#f36c3a] opacity-100" : "border-2.5 border-transparent opacity-45"}
            `}
          />
        ))}
      </div>
    </div>
  );
}