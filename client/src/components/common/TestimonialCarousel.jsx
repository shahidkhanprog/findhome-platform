import { useState, useEffect, useRef } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonialData = [
  {
    id: 1,
    quote: "Found our dream home in DHA Phase 6 within 2 weeks. The team handled everything — from shortlisting to final registry. Zero stress, total transparency.",
    name: "Ahmed Raza",
    role: "First-Time Home Buyer",
    location: "Lahore, Punjab",
    image: "/user-testimonial-1.jpg",
    rating: 5,
    tag: "Home Purchase",
  },
  {
    id: 2,
    quote: "As an overseas Pakistani, I was worried about investing remotely. Their team verified every document and gave me live video walkthroughs. Bought a plot in Bahria Town with full confidence.",
    name: "Usman Malik",
    role: "Overseas Investor",
    location: "Manchester, UK",
    image: "/user-testimonial-2.jpg",
    rating: 5,
    tag: "Plot Investment",
  },
  {
    id: 3,
    quote: "Rented out my 3 apartments through their property management service. They handle tenants, maintenance, and send me monthly reports. Best decision I've made as a landlord.",
    name: "Sadia Noor",
    role: "Property Landlord",
    location: "Islamabad, ICT",
    image: "/user-testimonial-3.jpg",
    rating: 5,
    tag: "Property Management",
  },
  {
    id: 4,
    quote: "We needed a commercial space for our new office in Gulberg. They showed us 6 options in one day, negotiated the rent down, and had the lease ready in 48 hours.",
    name: "Bilal Chaudhry",
    role: "Business Owner",
    location: "Lahore, Punjab",
    image: "/user-testimonial-4.jpg",
    rating: 5,
    tag: "Commercial Rental",
  },
  {
    id: 5,
    quote: "Their investment advisory team helped me identify an undervalued sector in Swat. 14 months later, the property value has gone up by 40%. Exceptional market knowledge.",
    name: "Dr. Farhan Yusuf",
    role: "Real Estate Investor",
    location: "Peshawar, KPK",
    image: "/user-testimonial-5.jpg",
    rating: 5,
    tag: "Investment Advisory",
  },
  {
    id: 6,
    quote: "The legal team caught a title dispute on a property I almost purchased. Saved me from a massive loss. Their due diligence is genuinely thorough and trustworthy.",
    name: "Hina Baig",
    role: "Property Buyer",
    location: "Rawalpindi, Punjab",
    image: "/user-testimonial-6.jpg",
    rating: 5,
    tag: "Legal & Documentation",
  },
];

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const touchStartX = useRef(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1);
      else if (w < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = testimonialData.length - slidesPerView;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  const GAP = 12;

  return (
    <section className="py-16 sm:py-20 bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
            Client Stories
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900">
            Real people.{" "}
            <span className="text-[#f36c3a]">Real results.</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            From first-time buyers to seasoned investors — hear what our clients
            say about their experience working with us.
          </p>
        </div>

        {/* ── Carousel ── */}
        <div className="relative pb-14">

          {/* Prev Arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous testimonial"
            className={`absolute left-0 top-[45%] -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none -translate-x-1/2 ${current === 0 ? "opacity-40 pointer-events-none" : ""}`}
          >
            <FaChevronLeft size={14} />
          </button>

          {/* Overflow clip wrapper */}
          <div
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex"
              style={{
                gap: GAP,
                transform: `translateX(calc(-${current * (100 / slidesPerView)}% - ${current * GAP}px))`,
                transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {testimonialData.map((item) => (
                <div
                  key={item.id}
                  style={{
                    flex: `0 0 calc(${100 / slidesPerView}% - ${(GAP * (slidesPerView - 1)) / slidesPerView}px)`,
                    minWidth: 0,
                  }}
                  className="py-3"
                >
                  {/* Card — identical to original */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[340px] sm:h-[360px] justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                    {/* Top: Tag + Stars */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#f36c3a]/10 text-[#f36c3a] px-2.5 py-1 rounded-full">
                        {item.tag}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative flex-1">
                      <FaQuoteLeft className="text-[#f36c3a]/15 text-4xl sm:text-5xl absolute -top-1 -left-1 select-none" />
                      <p className="text-slate-500 italic leading-relaxed text-sm sm:text-base pt-6 line-clamp-4">
                        {item.quote}
                      </p>
                    </div>

                    {/* Divider + Author */}
                    <div className="border-t border-slate-100 mt-4 pt-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#f36c3a]/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#f36c3a] font-semibold uppercase tracking-wide truncate">
                            {item.role}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{item.location}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={next}
            disabled={current === maxIndex}
            aria-label="Next testimonial"
            className={`absolute right-0 top-[45%] -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none translate-x-1/2 ${current === maxIndex ? "opacity-40 pointer-events-none" : ""}`}
          >
            <FaChevronRight size={14} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pt-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="focus:outline-none transition-all duration-300"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === current ? "#f36c3a" : "#cbd5e1",
                  transform: i === current ? "scale(1.25)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialCarousel;