import React, { useState } from 'react';
import { Store, Tag, Zap, Package, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Lock, User, Mail, CheckCircle } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import ForgotPasswordPage from './ForgotPasswordPage';
import { loginData, registerData } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const res = await loginData(form);

            if (res.status) {
                alert(res.message);
                localStorage.setItem("token", res.token);
                const role = res.role;
                if (role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    rememberMe: false,
                });
            } else {
                alert(res.message);
            }
        } else {
            const res = await registerData(form);

            if (res.status) {
                alert(res.message);
                setIsLogin(true);

                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } else {
                alert(res.message);
            }
        }
    };

    if (showForgotPassword) {
        return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="w-full min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-stone-900">

            {/* Main Modern Luxury Card Container */}
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-stone-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

                {/* LEFT SIDE: Visual Brand Showcase */}
                <div className="lg:col-span-5 bg-stone-900 relative p-8 sm:p-12 text-white flex flex-col justify-between overflow-hidden min-h-[320px] lg:min-h-full">
                    
                    {/* Background Overlay */}
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                        alt="Storefront Ambience"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-950/90" />

                    {/* Top Brand Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 backdrop-blur-md shadow-inner">
                            <Store size={22} />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-white block uppercase">
                                ShopNest
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 -mt-1 block">
                                Luxury Studio
                            </span>
                        </div>
                    </div>

                    {/* Middle Copy Section */}
                    <div className="relative z-10 my-auto py-8 space-y-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                <Sparkles size={12} /> Membership Vault
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                {isLogin ? "Curated Shopping Experience" : "Unlock Personal Access"}
                            </h2>
                            <p className="text-stone-300 text-xs sm:text-sm font-medium leading-relaxed">
                                {isLogin
                                    ? "Welcome back. Log in to view your saved items, track active dispatches, and access private drop notifications."
                                    : "Join our boutique collective to enjoy seamless checkout, order tracking, and bespoke recommendations."}
                            </p>
                        </div>

                        {/* Key Pillars */}
                        <div className="space-y-3 pt-2">
                            {[
                                { icon: Tag, label: "Exclusive member-only releases" },
                                { icon: Zap, label: "Express white-glove shipping" },
                                { icon: ShieldCheck, label: "256-Bit encrypted checkout" },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-center gap-3 text-xs font-extrabold text-stone-200">
                                        <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-300 shrink-0">
                                            <Icon size={14} />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Badge */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-extrabold text-stone-400">
                        <span>© {new Date().getFullYear()} ShopNest Inc.</span>
                        <span className="flex items-center gap-1 text-stone-300">
                            <Lock size={12} className="text-amber-300" /> Protected Portal
                        </span>
                    </div>

                </div>

                {/* RIGHT SIDE: Interactive Auth Form */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">

                    {/* Segmented Switcher */}
                    <div className="bg-stone-100 p-1 rounded-2xl flex border border-stone-200/60 mb-8">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                                isLogin
                                    ? "bg-stone-900 text-amber-200 shadow-md"
                                    : "text-stone-500 hover:text-stone-900"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                                !isLogin
                                    ? "bg-stone-900 text-amber-200 shadow-md"
                                    : "text-stone-500 hover:text-stone-900"
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name (Register Mode) */}
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Alexander Wright"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full text-xs sm:text-sm font-semibold pl-10 pr-4 py-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 focus:bg-white focus:border-amber-600 focus:outline-none transition-all"
                                    />
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                                </div>
                            </div>
                        )}

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@domain.com"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-semibold pl-10 pr-4 py-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 focus:bg-white focus:border-amber-600 focus:outline-none transition-all"
                                />
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                                    Password
                                </label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs font-extrabold text-amber-800 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={form.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-semibold pl-10 pr-10 py-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 focus:bg-white focus:border-amber-600 focus:outline-none transition-all"
                                />
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Register Mode) */}
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••••••"
                                        value={form.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full text-xs sm:text-sm font-semibold pl-10 pr-4 py-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 focus:bg-white focus:border-amber-600 focus:outline-none transition-all"
                                    />
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                                </div>
                            </div>
                        )}

                        {/* Remember Me Checkbox */}
                        {isLogin && (
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-900 cursor-pointer"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-xs font-bold text-stone-600 cursor-pointer select-none"
                                >
                                    Stay logged in on this browser
                                </label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                        >
                            <span>{isLogin ? "Sign In To Account" : "Create Studio Account"}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Social Section */}
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200/80" />
                        </div>
                        <span className="relative z-10 bg-white px-3 text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
                            Or Connect With
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-stone-200/80 hover:bg-stone-50 text-xs font-extrabold text-stone-700 transition-all shadow-sm"
                        >
                            <FaGoogle className="text-red-500 text-sm" />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-stone-200/80 hover:bg-stone-50 text-xs font-extrabold text-stone-700 transition-all shadow-sm"
                        >
                            <FaFacebookF className="text-blue-600 text-sm" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Bottom Prompt Link */}
                    <p className="text-center text-xs font-medium text-stone-500 mt-6">
                        {isLogin ? "New to ShopNest? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-extrabold text-amber-800 hover:text-stone-900 underline"
                        >
                            {isLogin ? "Create an account" : "Sign in here"}
                        </button>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default AuthPage;