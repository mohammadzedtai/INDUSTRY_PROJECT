import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Award, Users2, Truck, ArrowRight, CheckCircle2, Compass, Feather, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('heritage');

  const tabContents = {
    heritage: {
      title: "Rooted In Elegance, Built For Tomorrow",
      description: "ShopNest was born out of a desire to break away from fast-fashion noise. Founded with a commitment to timeless aesthetic standards, we hand-select pieces that resonate with individuality, durability, and quiet luxury.",
      highlights: ["Hand-curated global selections", "Focus on organic and premium textiles", "Timeless cuts designed for longevity"]
    },
    craftsmanship: {
      title: "Precision In Every Stitch & Detail",
      description: "We partner exclusively with master artisans and verified global fashion houses. Every product in our collection undergoes a rigorous multi-point quality check before it enters our digital boutique.",
      highlights: ["100% verified authentic products", "Ethical manufacturing partnerships", "Uncompromising quality assurance"]
    },
    sustainability: {
      title: "Mindful Living, Conscious Fashion",
      description: "Luxury should not come at the expense of our planet. From eco-conscious minimal packaging to carbon-neutral shipping initiatives, we are dedicated to reducing our environmental footprint.",
      highlights: ["Biodegradable & plastic-free packaging", "Support for sustainable textile farms", "Zero-waste inventory management"]
    }
  };

  const stats = [
    { label: 'Happy Customers Worldwide', value: '100K+' },
    { label: 'Handpicked Luxury Items', value: '15K+' },
    { label: 'Verified Global Brands', value: '300+' },
    { label: 'Verified Client Rating', value: '4.9/5' },
  ];

  const advantages = [
    {
      icon: ShieldCheck,
      title: "100% Guaranteed Authentic",
      desc: "Direct partnership with certified global luxury labels ensuring absolute originality."
    },
    {
      icon: Truck,
      title: "Priority Global Shipping",
      desc: "Insured, trackable, and swift white-glove express delivery right to your door."
    },
    {
      icon: Award,
      title: "Strict Quality Control",
      desc: "Each item passes through a 5-step inspection process prior to dispatch."
    },
    {
      icon: Users2,
      title: "24/7 Styling Concierge",
      desc: "Personalized fashion assistance and dedicated customer support at all times."
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-24 font-sans text-stone-900">
      
      {/* 1. Asymmetric Split Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Headline & Introduction */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-700" />
              <span>Redefining The Standard</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950 leading-[1.1]">
              Elevating Modern Fashion Through Mindful Curation.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              ShopNest is an online sanctuary for those who value refined design over temporary trends. We bridge luxury craftsmanship with everyday functionality.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/product"
                className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-black text-amber-200 font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Browse The Collection</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right: Modern Overlapping Image Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-96">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
                alt="High Fashion Showcase"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Floating Glassmorphic Badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-stone-200 shadow-xl max-w-xs hidden sm:block">
              <p className="text-2xl font-black text-amber-800">100%</p>
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-0.5">
                Curated Authentic Merchandise
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Numerical Impact Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-20">
        <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-stone-800">
            {stats.map((stat, idx) => (
              <div key={idx} className={`text-center space-y-1 ${idx !== 0 ? 'md:pl-6' : ''}`}>
                <p className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-stone-400 tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Story Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-20">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/80 shadow-sm space-y-10">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 inline-block">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Behind The Brand
              </h2>
            </div>

            {/* Custom Tab Switcher */}
            <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-1">
              {[
                { id: 'heritage', label: 'Heritage', icon: Compass },
                { id: 'craftsmanship', label: 'Craftsmanship', icon: Feather },
                { id: 'sustainability', label: 'Sustainability', icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-stone-950 shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl font-black text-stone-900">
                {tabContents[activeTab].title}
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
                {tabContents[activeTab].description}
              </p>
              
              <ul className="space-y-3 pt-2">
                {tabContents[activeTab].highlights.map((point, index) => (
                  <li key={index} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-stone-800">
                    <CheckCircle2 size={18} className="text-amber-700 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-amber-50/60 border border-amber-200/80 p-8 rounded-3xl space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Did You Know?
                </span>
                <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                  Every order placed on ShopNest is packed with zero plastic using 100% recyclable materials, ensuring luxury without compromising environmental ethics.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Advantages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            The ShopNest Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Designed to deliver an unparalleled online shopping experience from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-20">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready To Redefine Your Wardrobe?
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Explore our latest arrivals and experience luxury fashion tailored specifically for you.
          </p>
          <div className="pt-2">
            <Link
              to="/product"
              className="inline-flex items-center gap-2 bg-stone-950 hover:bg-black text-amber-300 font-extrabold px-8 py-4 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
            >
              <span>Explore Shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;