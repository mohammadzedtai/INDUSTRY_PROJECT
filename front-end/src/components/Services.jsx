import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset, Sparkles } from 'lucide-react';

const services = [
  {
    id: 1,
    icon: Truck,
    title: 'Express Delivery',
    description: 'Free shipping on orders above ₹999',
    badge: 'Fast'
  },
  {
    id: 2,
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description: 'Instant replacement & hassle-free refund',
    badge: 'Flexible'
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: '100% Safe Payments',
    description: 'Encrypted UPI, Cards & NetBanking',
    badge: 'Secure'
  },
  {
    id: 4,
    icon: Headset,
    title: 'Premium Concierge',
    description: '24/7 dedicated customer assistance',
    badge: 'Support'
  },
];

const Services = () => {
  return (
    <section className="w-full bg-gradient-to-b from-amber-50/40 via-white to-stone-50/50 py-12 px-4 sm:px-6 lg:px-8 border-y border-amber-100/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/70 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 cursor-default overflow-hidden"
              >
                {/* Top Subtle Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start gap-4">
                  {/* Icon Container with Smooth Hover Effects */}
                  <div className="relative w-12 h-12 rounded-xl bg-amber-100/60 border border-amber-200/80 flex items-center justify-center text-amber-800 shrink-0 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 group-hover:scale-105 transition-all duration-300 shadow-sm">
                    <IconComponent size={22} className="transition-transform duration-300 group-hover:rotate-6" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Subtle Background Glow */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-100/30 rounded-full blur-2xl group-hover:bg-amber-200/40 transition-all pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;