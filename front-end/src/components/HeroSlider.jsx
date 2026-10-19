import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    badge: "New Collection 2026",
    title: "Style Meets Ultimate Comfort",
    subtitle: "Discover curated luxury fashion designed for modern lifestyle & effortless elegance.",
    buttonText: "Shop Collection",
    buttonLink: "/product",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "Trending Season Sale",
    title: "Elevate Your Everyday Look",
    subtitle: "Explore breathable fabrics, vibrant prints, and minimalist urban apparel.",
    buttonText: "Explore Trends",
    buttonLink: "/product",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "Minimalist Essentials",
    title: "Crafted For The Modern Individual",
    subtitle: "Upgrade your wardrobe with timeless pieces built with premium craftsmanship.",
    buttonText: "Discover Products",
    buttonLink: "/product",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play slider (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-gray-950 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hero Container */}
      <div className="relative h-[70vh] sm:h-[80vh] lg:h-[88vh] w-full">

        {/* Slide Items */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Cinematic Ken Burns Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>

              {/* Multi-layered Dark Vignette Overlay for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

              {/* Main Content Area */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                  <div className={`max-w-2xl text-white space-y-6 transition-all duration-700 delay-200 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                      <Sparkles size={14} className="text-amber-400" />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-white">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link
                        to={slide.buttonLink}
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Side Navigation Arrows (Glassmorphism design) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
        >
          <ChevronRight size={24} />
        </button>

        {/* Bottom Bar: Slide Counter & Indicators */}
        <div className="absolute bottom-8 inset-x-0 z-30 px-6 sm:px-12 lg:px-16 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Active Dots */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-10 bg-amber-500 shadow-md shadow-amber-500/50'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Numerical Slide Counter */}
          <div className="text-white/80 font-mono text-sm tracking-widest font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <span className="text-amber-400">0{currentSlide + 1}</span>
            <span className="text-white/40 mx-1">/</span>
            <span>0{slides.length}</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSlider;