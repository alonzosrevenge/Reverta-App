import { useLocation } from "wouter";
import { ArrowLeft, MessageSquare, Users, Heart, ExternalLink, Star } from "lucide-react";
const logoImage = "/assets/Untitled design_1755057237773.png";

export default function Community() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    setLocation("/cards");
  };

  const handleJoinDiscord = () => {
    window.open("https://discord.gg/x9Zj7Jzh", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 shadow-2xl">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center p-2">
                  <img 
                    src={logoImage} 
                    alt="Reverta Logo" 
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Reverta Community
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
            Connect with fellow Muslim reverts on their spiritual journey. Share experiences, ask questions, and grow together in faith.
          </p>
        </div>

        {/* Discord Community Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl animate-scale-in relative overflow-hidden mb-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-yellow-400/5"></div>
          
          <div className="relative z-10">
            {/* Discord Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <MessageSquare className="text-white w-10 h-10" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                Join Our Discord Server
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Connect with hundreds of Muslim reverts in our supportive Discord community. Get real-time support, join study groups, and build lasting friendships with people who understand your journey.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Support Groups</h3>
                <p className="text-slate-400 text-sm">Join dedicated channels for different stages of your journey</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Study Sessions</h3>
                <p className="text-slate-400 text-sm">Participate in Quran study and Islamic knowledge sessions</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Mentorship</h3>
                <p className="text-slate-400 text-sm">Connect with experienced community members for guidance</p>
              </div>
            </div>

            {/* Join Button */}
            <div className="text-center">
              <button
                onClick={handleJoinDiscord}
                className="btn-primary text-black px-12 py-4 rounded-full text-xl font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 inline-flex items-center gap-4 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="w-6 h-6" />
                Join Discord Community
                <ExternalLink className="w-5 h-5" />
              </button>
              <p className="text-slate-400 text-sm mt-4">
                Free to join • Safe space • Active moderation
              </p>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-slate-200 mb-4 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Community Values
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Respectful and supportive conversations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>No judgment zone for questions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Celebrating every step of growth</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Learning together at our own pace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse -z-10" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}