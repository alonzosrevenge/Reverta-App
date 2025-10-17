import { useLocation } from "wouter";
import { Clock, ArrowLeft } from "lucide-react";

const prayers = [
  { name: "Fajr", arabic: "الفجر", time: "Dawn Prayer" },
  { name: "Dhuhr", arabic: "الظهر", time: "Midday Prayer" },
  { name: "Asr", arabic: "العصر", time: "Afternoon Prayer" },
  { name: "Maghrib", arabic: "المغرب", time: "Sunset Prayer" },
  { name: "Isha", arabic: "العشاء", time: "Night Prayer" }
];

export default function PrayPage() {
  const [, setLocation] = useLocation();

  const handleSelect = (prayer: string) => {
    setLocation(`/${prayer.toLowerCase()}`);
  };

  const handleBack = () => {
    setLocation("/cards");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      <div className="text-center max-w-4xl mx-auto">
        {/* Prayer Icon */}
        <div className="mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 animate-pulse"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-2xl flex items-center justify-center">
              <Clock className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Choose Your Prayer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Select one of the five daily prayers to begin your spiritual moment ✨
          </p>
        </div>

        {/* Prayer Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {prayers.map((prayer, index) => (
            <button
              key={prayer.name}
              onClick={() => handleSelect(prayer.name)}
              className="group relative p-6 rounded-2xl bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:border-purple-500/50"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Button Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Prayer Name */}
              <div className="relative z-10">
                {/* Arabic Script */}
                <div className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ fontFamily: 'serif' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
                    {prayer.arabic}
                  </span>
                </div>
                
                {/* English Name */}
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                  {prayer.name}
                </h3>
                
                {/* Time description */}
                <p className="text-slate-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {prayer.time}
                </p>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-br from-yellow-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-500/15 to-yellow-400/15 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-purple-500/15 rounded-full blur-2xl animate-pulse -z-10" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}