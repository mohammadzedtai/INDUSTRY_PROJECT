import React, { useState } from 'react';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Sending password reset link to:', email);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 relative flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Background Decorative Image / Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
          alt="Mountain background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Center Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
        
        {/* Lock Icon Circle Badge */}
        <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#F0E6D8] flex items-center justify-center mx-auto mb-6 text-stone-800">
          <Lock size={26} strokeWidth={2.2} />
        </div>

        {!isSubmitted ? (
          <>
            {/* Heading & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Forgot Password?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs font-semibold p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-white text-gray-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#081225] hover:bg-black text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.99] mt-2"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          /* Success Message State */
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Reset Link Sent!
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              We have sent a password reset link to <span className="font-bold text-gray-900">{email}</span>. Please check your inbox.
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-8 pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors underline"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        </div>

      </div>

    </div>
  );
};

export default ForgotPasswordPage;