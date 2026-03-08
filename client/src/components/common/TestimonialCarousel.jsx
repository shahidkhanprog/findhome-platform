import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialData = [
  {
    id: 1,
    quote: "Found our dream home in DHA Phase 6 within 2 weeks. The team handled everything — from shortlisting to final registry. Zero stress, total transparency.",
    name: "Ahmed Raza",
    role: "First-Time Home Buyer",
    location: "Lahore, Punjab",
    image: "https://i.pravatar.cc/150?u=11",
    rating: 5,
    tag: "Home Purchase",
  },
  {
    id: 2,
    quote: "As an overseas Pakistani, I was worried about investing remotely. Their team verified every document and gave me live video walkthroughs. Bought a plot in Bahria Town with full confidence.",
    name: "Usman Malik",
    role: "Overseas Investor",
    location: "Manchester, UK",
    image: "https://i.pravatar.cc/150?u=22",
    rating: 5,
    tag: "Plot Investment",
  },
  {
    id: 3,
    quote: "Rented out my 3 apartments through their property management service. They handle tenants, maintenance, and send me monthly reports. Best decision I've made as a landlord.",
    name: "Sadia Noor",
    role: "Property Landlord",
    location: "Islamabad, ICT",
    image: "https://i.pravatar.cc/150?u=33",
    rating: 5,
    tag: "Property Management",
  },
  {
    id: 4,
    quote: "We needed a commercial space for our new office in Gulberg. They showed us 6 options in one day, negotiated the rent down, and had the lease ready in 48 hours.",
    name: "Bilal Chaudhry",
    role: "Business Owner",
    location: "Lahore, Punjab",
    image: "https://i.pravatar.cc/150?u=44",
    rating: 5,
    tag: "Commercial Rental",
  },
  {
    id: 5,
    quote: "Their investment advisory team helped me identify an undervalued sector in Swat. 14 months later, the property value has gone up by 40%. Exceptional market knowledge.",
    name: "Dr. Farhan Yusuf",
    role: "Real Estate Investor",
    location: "Peshawar, KPK",
    image: "https://i.pravatar.cc/150?u=55",
    rating: 5,
    tag: "Investment Advisory",
  },
  {
    id: 6,
    quote: "The legal team caught a title dispute on a property I almost purchased. Saved me from a massive loss. Their due diligence is genuinely thorough and trustworthy.",
    name: "Hina Baig",
    role: "Property Buyer",
    location: "Rawalpindi, Punjab",
    image: "https://i.pravatar.cc/150?u=66",
    rating: 5,
    tag: "Legal & Documentation",
  },
];

// Custom next arrow
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next testimonial"
    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none translate-x-1/2"
  >
    <FaChevronRight size={14} />
  </button>
);

// Custom prev arrow
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous testimonial"
    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none -translate-x-1/2"
  >
    <FaChevronLeft size={14} />
  </button>
);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4500,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  dotsClass: "slick-dots custom-dots",
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: "20px",
      },
    },
  ],
};

const TestimonialCarousel = () => {
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
        <div className="relative px-6 sm:px-8 pb-14 overflow-hidden">
          <Slider {...sliderSettings}>
            {testimonialData.map((item) => (
              <div key={item.id} className="px-2 sm:px-3 outline-none py-3 mb-10">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[340px] sm:h-[360px] justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  {/* Top: Tag + Stars */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Category tag */}
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#f36c3a]/10 text-[#f36c3a] px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                    {/* Star rating */}
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

                  {/* Divider */}
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
          </Slider>
        </div>

      </div>

      <style>{`
        .slick-list { overflow: visible !important; }
        .custom-dots { bottom: 0 !important; }
        .custom-dots li { margin: 0 3px; width: 10px; height: 10px; }
        .custom-dots li button:before { font-size: 9px; color: #cbd5e1; opacity: 1; transition: all 0.3s; }
        .custom-dots li.slick-active button:before { color: #f36c3a; font-size: 11px; }
      `}</style>
    </section>
  );
};

export default TestimonialCarousel;