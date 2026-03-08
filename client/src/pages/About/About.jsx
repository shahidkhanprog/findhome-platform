import React from 'react';
import { FaAward, FaUsers, FaBuilding, FaCheckCircle, FaHandshake, FaBullseye, FaChartLine } from 'react-icons/fa';

const About = () => {
  return (
    <div className="font-sans text-[#101828] bg-white overflow-x-hidden">
      {/* 1. Impact Hero - Parallax */}
      <section 
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')`,
          backgroundAttachment: "fixed" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/40"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <span className="text-[#f36c3a] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Est. 2016</span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Redefining the Standard of <span className="text-[#f36c3a]">Modern Living</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed">
            A legacy built on discipline, responsibility, and the pursuit of long-term stability.
          </p>
        </div>
      </section>

      {/* 2. The Brand Story - Rich Split Section */}
      <section className="py-24 px-6 lg:px-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 relative">
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#f36c3a] rounded-2xl z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Real Estate" 
              className="relative z-10 rounded-2xl shadow-2xl w-full h-[600px] object-cover"
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              We Don't Just Sell Homes; We Build <span className="text-[#f36c3a]">Legacies</span>.
            </h2>
            <p className="text-[#667085] text-lg leading-relaxed">
              Our journey started with a simple realization: the real estate market lacked a partner that valued responsibility over temporary success.
            </p>
            <p className="text-[#667085] text-lg leading-relaxed">
              Today, we provide a full suite of services—from luxury buying to expert property management—ensuring every client experiences a smooth and profitable transition.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="bg-[#fef7f6] p-6 rounded-2xl border-l-4 border-[#f36c3a] flex-1">
                <h4 className="font-bold text-xl mb-1">Our Mission</h4>
                <p className="text-sm text-[#667085]">To provide world-class property solutions with zero shortcuts.</p>
              </div>
              <div className="bg-[#fef7f6] p-6 rounded-2xl border-l-4 border-[#f36c3a] flex-1">
                <h4 className="font-bold text-xl mb-1">Our Vision</h4>
                <p className="text-sm text-[#667085]">Setting global standards in real estate management and UX.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Impact Stats - Dark Theme */}
      <section className="bg-[#101828] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-3">
              <h3 className="text-5xl md:text-6xl font-extrabold text-white">10+</h3>
              <p className="text-[#f36c3a] font-bold uppercase tracking-widest text-xs">Years Experience</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-5xl md:text-6xl font-extrabold text-white">30+</h3>
              <p className="text-[#f36c3a] font-bold uppercase tracking-widest text-xs">Awards Gained</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-5xl md:text-6xl font-extrabold text-white">500+</h3>
              <p className="text-[#f36c3a] font-bold uppercase tracking-widest text-xs">Happy Clients</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-5xl md:text-6xl font-extrabold text-white">100+</h3>
              <p className="text-[#f36c3a] font-bold uppercase tracking-widest text-xs">Ready Properties</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values - Icon Grid */}
      <section className="py-24 px-6 lg:px-32 bg-[#fef7f6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Pillars of Our <span className="text-[#f36c3a]">Success</span></h2>
            <div className="w-20 h-1.5 bg-[#f36c3a] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<FaHandshake size={40} />} 
              title="Integrity" 
              desc="Transparent property dealings that build lifelong trust with our investors."
            />
            <ValueCard 
              icon={<FaBullseye size={40} />} 
              title="Discipline" 
              desc="Strict adherence to professional standards over temporary gains."
            />
            <ValueCard 
              icon={<FaChartLine size={40} />} 
              title="Excellence" 
              desc="Delivering pixel-perfect digital experiences and property maintenance."
            />
          </div>
        </div>
      </section>

      {/* 5. Final CTA - Parallax Parallax */}
      <section 
        className="relative py-32 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')`,
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-[#f36c3a]/90"></div>
        <div className="relative z-10 text-center text-white px-6 space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Ready to Find Your <br /> Next Chapter?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#f36c3a] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-slate-900 hover:text-white transition-all">
              Browse Properties
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#f36c3a] transition-all">
              Contact Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Component for Values
const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
    <div className="text-[#f36c3a] mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-2xl font-bold mb-4">{title}</h4>
    <p className="text-[#667085] leading-relaxed">{desc}</p>
  </div>
);

export default About;