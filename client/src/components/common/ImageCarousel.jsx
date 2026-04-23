import { useState, useEffect, useCallback } from "react";
import { MdChevronLeft, MdChevronRight, MdImage } from "react-icons/md";

export default function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : 0;

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  if (!hasImages) {
    return (
      <div className="relative h-44 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-2">
          <MdImage size={40} className="text-violet-300" />
          <span className="text-[11px] text-violet-400 font-medium">No photos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden bg-slate-100">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: `${total * 100}%`,
          transform: `translateX(calc(-${current} * (100% / ${total})))`,
        }}
      >
        {images.map((url, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 h-full"
            style={{ width: `calc(100% / ${total})` }}
          >
            <img
              src={url}
              alt={`${title} photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm z-10 shadow-md"
          >
            <MdChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm z-10 shadow-md"
          >
            <MdChevronRight size={18} />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}