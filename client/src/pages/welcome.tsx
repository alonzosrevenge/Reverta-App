import { useLocation } from "wouter";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const logoImage = "/assets/Untitled design_1755057237773.png" as const;

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const handleBeginClick = () => {
    if (isAuthenticated) {
      setLocation("/my-journey");
    } else {
      setLocation("/register");
    }
  };

  const handleLoginClick = () => {
    setLocation("/login");
  };

  const handleRegisterClick = () => {
    setLocation("/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in relative overflow-hidden">
      <div className="text-center max-w-3xl mx-auto">
        {/* Reverta Logo */}
        <div className="mb-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto flex items-center justify-center relative">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-amber-500/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Logo container with gradient border */}
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 shadow-2xl">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center p-2">
                <img 
                  src={logoImage} 
                  alt="Reverta Islamic Geometric Logo" 
                  className="w-full h-full object-contain filter brightness-110 contrast-110"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-6xl md:text-7xl font-black mb-2 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Welcome to Reverta
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light mb-6 leading-relaxed" style={{ fontFamily: 'serif' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Begin your <span className="text-purple-400 font-medium">spiritual journey</span> with our community of faith, prayer, and growth ✨
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="animate-slide-up relative z-20 space-y-4" style={{ animationDelay: '0.2s' }}>
          {isAuthenticated ? (
            <button 
              onClick={handleBeginClick}
              className="btn-primary text-black px-16 py-5 rounded-full text-xl font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 inline-flex items-center gap-4 backdrop-blur-sm relative z-30 cursor-pointer hover:cursor-pointer"
              type="button"
            >
              Continue Your Journey
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center">
              <button 
                onClick={handleBeginClick}
                className="btn-primary text-black px-16 py-5 rounded-full text-xl font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 inline-flex items-center gap-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                <UserPlus className="w-6 h-6" />
                Begin Your Journey
              </button>
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={handleLoginClick}
                  className="text-purple-400 font-medium hover:text-pink-400 transition-colors underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
        
        {/* Subtitle */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            FOR MUSLIM REVERTS • BY THE COMMUNITY
          </p>
        </div>
      </div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse -z-10" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
