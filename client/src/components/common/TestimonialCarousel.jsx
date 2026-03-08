import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Required Slick Carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const TestimonialCarousel = () => {
  const testimonialData = [
    {
      id: 1,
      quote: "Top-notch real estate service, always available with expert guidance. Highly professional and truly dedicated to clients' needs.",
      name: "Michael Thompson",
      role: "Software Engineer",
      image: "https://i.pravatar.cc/150?u=1"
    },
    {
      id: 2,
      quote: "Dedicated real estate experts, always ready to help. Their support was invaluable throughout my buying experience.",
      name: "Daniel Martinez",
      role: "Product Designer",
      image: "https://i.pravatar.cc/150?u=2"
    },
    {
      id: 3,
      quote: "Fantastic real estate experience. The team was professional, responsive, and genuinely focused on my needs.",
      name: "Michael Smith",
      role: "Medical Officer",
      image: "https://i.pravatar.cc/150?u=3"
    },
    {
      id: 4,
      quote: "Exceptional market knowledge and seamless property management. Highly recommended for investors.",
      name: "Sarah Lee",
      role: "Real Estate Investor",
      image: "https://i.pravatar.cc/150?u=4"
    },
    {
      id: 5,
      quote: "Exceptional market knowledge and seamless property management. Highly recommended for investors.",
      name: "Sarah Lee",
      role: "Real Estate Investor",
      image: "https://i.pravatar.cc/150?u=4"
    }
  ];

  // Custom Arrows
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-[10px] top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none translate-x-1/2"
    >
      <FaChevronRight size={16} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-[10px] top-1/2 -translate-y-1/2 z-30 bg-[#f36c3a] text-white p-3 rounded-full shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center border-2 border-white focus:outline-none -translate-x-1/2"
    >
      <FaChevronLeft size={16} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
        }
      }
    ]
  };

  return (
    <section className="py-20 bg-slate-100 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828]">
            Clients speak volumes <span className="text-[#f36c3a]">about us</span>
          </h2>
          <p className="text-[#667085] mt-4 text-lg">Listen to the stories of our satisfied clients.</p>
        </div>

        {/* The pb-12 here provides space for the dots inside the relative container */}
        <div className="relative px-4 w-full pb-12 overflow-hidden"> 
          <Slider {...settings}>
            {testimonialData.map((item) => (
              <div key={item.id} className="px-3 outline-none py-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[400px] justify-between transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  
                  <div className="relative">
                    <span className="text-[#f36c3a]/20 text-7xl font-serif absolute -top-4 -left-2 select-none">“</span>
                    <p className="text-[#667085] italic leading-relaxed pt-8 text-base md:text-lg">
                      {item.quote}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#fef7f6]" 
                    />
                    <div>
                      <h4 className="font-bold text-[#101828] text-base">{item.name}</h4>
                      <p className="text-xs text-[#f36c3a] font-bold uppercase tracking-wider">{item.role}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style>{`
        /* 1. Ensure the list doesn't clip the dots or the cards */
        .slick-list { 
          overflow: visible !important; 
        }
        
        /* 2. Position dots clearly below the cards */
        .custom-dots { 
          bottom: -40px !important; 
        }

        .custom-dots li {
          margin: 0 4px;
          width: 12px;
          height: 12px;
        }

        /* 3. Style the dots (Inactive) */
        .custom-dots li button:before { 
          font-size: 10px; 
          color: #cbd5e1; 
          opacity: 1; 
          transition: all 0.3s ease;
        }

        /* 4. Style the active dot */
        .custom-dots li.slick-active button:before { 
          color: #f36c3a; 
          font-size: 12px;
        }
      `}</style>
    </section>
  );
};

export default TestimonialCarousel;