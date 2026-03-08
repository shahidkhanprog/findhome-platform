// import React from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// // Required Slick Carousel CSS
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

// const TestimonialCarousel = () => {
//   const testimonialData = [
//     {
//       id: 1,
//       quote: "Top-notch real estate service, always available with expert guidance. Highly professional and truly dedicated to clients' needs.",
//       name: "Michael Thompson",
//       role: "Software Engineer",
//       image: "https://i.pravatar.cc/150?u=1"
//     },
//     {
//       id: 2,
//       quote: "Dedicated real estate experts, always ready to help. Their support was invaluable throughout my buying experience.",
//       name: "Daniel Martinez",
//       role: "Product Designer",
//       image: "https://i.pravatar.cc/150?u=2"
//     },
//     {
//       id: 3,
//       quote: "Fantastic real estate experience. The team was professional, responsive, and genuinely focused on my needs.",
//       name: "Michael Smith",
//       role: "Medical Officer",
//       image: "https://i.pravatar.cc/150?u=3"
//     },
//     {
//       id: 4,
//       quote: "Exceptional market knowledge and seamless property management. Highly recommended for investors.",
//       name: "Sarah Lee",
//       role: "Real Estate Investor",
//       image: "https://i.pravatar.cc/150?u=4"
//     },
//     {
//       id: 5,
//       quote: "Exceptional market knowledge and seamless property management. Highly recommended for investors.",
//       name: "Sarah Lee",
//       role: "Real Estate Investor",
//       image: "https://i.pravatar.cc/150?u=4"
//     }
//   ];

//   // Custom Arrows
//   const NextArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute right-[10px] top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none translate-x-1/2"
//     >
//       <FaChevronRight size={16} />
//     </button>
//   );

//   const PrevArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute left-[10px] top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none -translate-x-1/2"
//     >
//       <FaChevronLeft size={16} />
//     </button>
//   );

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     dotsClass: "slick-dots custom-dots",
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: { slidesToShow: 2 }
//       },
//       {
//         breakpoint: 768,
//         settings: { 
//           slidesToShow: 1,
//           centerMode: true,
//           centerPadding: "30px",
//         }
//       }
//     ]
//   };

//   return (
//     <section className="py-20 bg-slate-100 overflow-hidden w-full">
//       <div className="max-w-7xl mx-auto px-6">
        
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828]">
//             Clients speak volumes <span className="text-[#f36c3a]">about us</span>
//           </h2>
//           <p className="text-[#667085] mt-4 text-lg">Listen to the stories of our satisfied clients.</p>
//         </div>

//         {/* The pb-12 here provides space for the dots inside the relative container */}
//         <div className="relative px-4 w-full pb-12 overflow-hidden"> 
//           <Slider {...settings}>
//             {testimonialData.map((item) => (
//               <div key={item.id} className="px-3 outline-none py-4">
//                 <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[400px] justify-between transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  
//                   <div className="relative">
//                     <span className="text-[#f36c3a]/20 text-7xl font-serif absolute -top-4 -left-2 select-none">“</span>
//                     <p className="text-[#667085] italic leading-relaxed pt-8 text-base md:text-lg">
//                       {item.quote}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-50">
//                     <img 
//                       src={item.image} 
//                       alt={item.name} 
//                       className="w-14 h-14 rounded-full object-cover border-2 border-[#fef7f6]" 
//                     />
//                     <div>
//                       <h4 className="font-bold text-[#101828] text-base">{item.name}</h4>
//                       <p className="text-xs text-[#f36c3a] font-bold uppercase tracking-wider">{item.role}</p>
//                     </div>
//                   </div>
                  
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>

//       <style>{`
//         /* 1. Ensure the list doesn't clip the dots or the cards */
//         .slick-list { 
//           overflow: visible !important; 
//         }
        
//         /* 2. Position dots clearly below the cards */
//         .custom-dots { 
//           bottom: -40px !important; 
//         }

//         .custom-dots li {
//           margin: 0 4px;
//           width: 12px;
//           height: 12px;
//         }

//         /* 3. Style the dots (Inactive) */
//         .custom-dots li button:before { 
//           font-size: 10px; 
//           color: #cbd5e1; 
//           opacity: 1; 
//           transition: all 0.3s ease;
//         }

//         /* 4. Style the active dot */
//         .custom-dots li.slick-active button:before { 
//           color: #f36c3a; 
//           font-size: 12px;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default TestimonialCarousel;

// TestimonialCarousel.jsx - Real estate client testimonials carousel
import React from "react";
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
    <section className="py-16 sm:py-20 bg-slate-50 w-full overflow-hidden">
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
              <div key={item.id} className="px-2 sm:px-3 outline-none py-3">
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