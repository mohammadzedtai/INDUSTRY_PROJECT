import React, { useState } from 'react';
import { MapPin, Mail, Phone, Sparkles, Send, CheckCircle2, Clock, MessageSquare, Headphones, Globe } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: '',
  });

  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setIsSent(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      inquiryType: 'General Inquiry',
      message: '',
    });

    setTimeout(() => {
      setIsSent(false);
    }, 6000);
  };

  return (
    <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen pb-24 font-sans text-stone-900">
      
      {/* 1. Header Hero Banner */}
      <div className="relative w-full bg-stone-950 py-16 sm:py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles size={14} className="text-amber-400" />
            <span>Dedicated Client Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            We’re Here To Assist You.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
            Have a question about an order, custom sizing, or luxury styling? Our private concierge desk is at your service.
          </p>
        </div>
      </div>

      {/* 2. Top Contact Info Cards Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-200/50 flex flex-col justify-between space-y-4 group hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Flagship Boutique</p>
              <p className="text-sm font-bold text-stone-900 mt-1 leading-snug">
                123 Green Park Avenue,<br />Ahmedabad, Gujarat - 382350
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-200/50 flex flex-col justify-between space-y-4 group hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Email Concierge</p>
              <p className="text-sm font-bold text-stone-900 mt-1">concierge@shopnest.com</p>
              <p className="text-[11px] text-stone-400 font-medium">Avg. response time: 2 hours</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-200/50 flex flex-col justify-between space-y-4 group hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <Phone size={22} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Direct Line</p>
              <p className="text-sm font-bold text-stone-900 mt-1">+91 (0) 98765 43210</p>
              <p className="text-[11px] text-stone-400 font-medium">Toll-free client helpline</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-200/50 flex flex-col justify-between space-y-4 group hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Working Hours</p>
              <p className="text-sm font-bold text-stone-900 mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
              <p className="text-[11px] text-stone-400 font-medium">Sunday: Closed for maintenance</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Split Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-16">
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side: Brand Commitment & Social Links */}
          <div className="lg:col-span-5 bg-stone-950 p-8 sm:p-12 text-white flex flex-col justify-between space-y-10 relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-md border border-amber-400/30 inline-block">
                Client Service Ethos
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Seamless Assistance, tailored to you.
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal">
                Whether you need assistance with an existing order, product details, or personal fashion advice, our team is dedicated to providing an unparalleled experience.
              </p>

              <div className="space-y-4 pt-4 border-t border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Headphones size={16} />
                  </div>
                  <span className="text-xs font-bold text-stone-200">24/7 Priority Support for Members</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Globe size={16} />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Worldwide Shipping Assistance</span>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div className="space-y-3 relative z-10 pt-6 border-t border-stone-800">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Follow ShopNest Studio
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#facebook"
                  className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all text-xs shadow-sm"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#instagram"
                  className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all text-xs shadow-sm"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#twitter"
                  className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all text-xs shadow-sm"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#linkedin"
                  className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all text-xs shadow-sm"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: Interactive Inquiry Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Send A Private Message
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Please complete the form below. Required fields are marked with an asterisk (*).
              </p>
            </div>

            {isSent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fadeIn">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received by our concierge desk.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Dual Names Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="e.g. Rahul"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 transition-all"
                  />
                </div>
              </div>

              {/* Inquiry Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 block">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 cursor-pointer transition-all"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Status & Tracking">Order Status & Tracking</option>
                  <option value="Returns & Exchange">Returns & Exchange</option>
                  <option value="Styling Consultation">Styling Consultation</option>
                  <option value="Wholesale & Partnerships">Wholesale & Partnerships</option>
                </select>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 block">Your Message *</label>
                <textarea
                  name="message"
                  placeholder="How can our client care team assist you today?"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-stone-50/50 resize-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <span>Submit Inquiry</span>
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactPage;