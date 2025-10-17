import { useLocation } from "wouter";
import { ArrowLeft, Map, Heart, Users, BookOpen, ArrowRight } from "lucide-react";
const logoImage = "/assets/Untitled design_1755057237773.png";
export default function Cards() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    setLocation("/");
  };

  const handleCardClick = (cardName: string) => {
    if (cardName === "Lingo Guide") {
      setLocation("/lingo-guide");
    } else if (cardName === "Pray") {
      setLocation("/pray");
    } else if (cardName === "My Journey") {
      setLocation("/my-journey");
    } else if (cardName === "Community") {
      setLocation("/community");
    } else {
      // For other cards, just log for now
      console.log(`${cardName} card clicked`);
    }
  };

  const cards = [
    {
      title: "My Journey",
      description: "Track your spiritual growth and personal reflections on your faith journey",
      icon: Map,
      gradient: "from-primary to-purple-600",
      color: "text-primary",
      delay: "0.2s"
    },
    {
      title: "Pray",
      description: "Find guided prayers, meditation, and quiet moments for spiritual connection",
      icon: Heart,
      gradient: "from-secondary to-emerald-600",
      color: "text-secondary",
      delay: "0.3s"
    },
    {
      title: "Community",
      description: "Connect with others, share experiences, and grow together in faith",
      icon: Users,
      gradient: "from-accent to-orange-600",
      color: "text-accent",
      delay: "0.4s"
    },
    {
      title: "Lingo Guide",
      description: "Learn spiritual terminology and deepen your understanding of faith concepts",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-600",
      color: "text-purple-500",
      delay: "0.5s"
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 animate-fade-in relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <button 
          onClick={handleBackClick}
          className="mb-8 text-slate-400 hover:text-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-xl p-3 inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/70"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Welcome
        </button>
        
        {/* Logo */}
        <div className="mb-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 shadow-xl">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center p-1">
                <img 
                  src={logoImage} 
                  alt="Reverta Logo" 
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-black mb-6 animate-slide-up leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
            Choose Your Path
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 font-light animate-slide-up max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.1s' }}>
          Select an area to explore and deepen your <span className="text-purple-400 font-medium">spiritual journey</span> 🌙
        </p>
      </div>
      
      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.title}
              className="group relative card-hover bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-700/50 cursor-pointer animate-scale-in hover:border-purple-400/50 transition-all duration-300" 
              style={{ animationDelay: card.delay }}
              onClick={() => handleCardClick(card.title)}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <div className="text-center relative z-10">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${card.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                  {card.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm mb-6">
                  {card.description}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:text-yellow-400 transition-colors duration-300">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}
