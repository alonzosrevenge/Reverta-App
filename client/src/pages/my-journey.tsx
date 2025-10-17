import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut, Bell, MessageCircle, Book } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api"; // ✅ Use the new scalable API helper

// Daily habit tracking items - new simplified system
const DAILY_HABITS = [
  {
    id: 'quran',
    emoji: "📖",
    title: "Read and Reflect on the Qur'an",
    description: "Start with one verse or a short page, with translation."
  },
  {
    id: 'morning',
    emoji: "🌞",
    title: "Begin Your Day with \"Bismillah\" or \"Alhamdulillah\"",
    description: "Say it upon starting your day / waking up."
  },
  {
    id: 'prayer',
    emoji: "🤲🏽",
    title: "Practice One Daily Salah",
    description: "Pick one prayer (e.g., Maghrib) and pray it with presence."
  },
  {
    id: 'community',
    emoji: "🤝",
    title: "Connect with Other Muslims",
    description: "Send a message or have a brief conversation."
  },
  {
    id: 'dua',
    emoji: "👐",
    title: "Make Du'a (Personal Prayer)",
    description: "Talk to Allah in your own words."
  },
  {
    id: 'knowledge',
    emoji: "📚",
    title: "Seek a Little Knowledge Each Day",
    description: "Learn one small thing (a Name of Allah, short du'a, or story)."
  }
];

// Get today's date string for localStorage key
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

// Progress messages based on completed habits
const getProgressMessage = (completedCount: number) => {
  if (completedCount === 0) {
    return "Take one small step to begin 🌱";
  } else if (completedCount < 3) {
    return "Beautiful—one more to complete today ✨";
  } else {
    return "Alhamdulillah. Allah recognizes both your actions and intentions to grow in your faith 🌙";
  }
};

// Progress Ring Component
function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const progress = Math.min(completed / 3, 1); // Cap at 100% when 3 habits are done
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <svg 
        className="transform -rotate-90" 
        width="128" 
        height="128"
      >
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="rgb(51 65 85)" // slate-600
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out'
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
            <stop offset="50%" stopColor="#ec4899" /> {/* pink-500 */}
            <stop offset="100%" stopColor="#eab308" /> {/* yellow-500 */}
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-slate-400 font-medium">Today</div>
        <div className="text-lg font-bold text-slate-200">
          {completed} / 3
        </div>
      </div>
    </div>
  );
}

function MyJourneyContent() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load today's habits
  useEffect(() => {
    const loadTodayHabits = async () => {
      const todayKey = getTodayKey();
      
      try {
        // Try to load from server first
        const response = await apiRequest(`/api/habits/today`, {
          method: 'GET'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.completedHabits) {
            setCompletedHabits(data.completedHabits);
          }
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(`habits_${todayKey}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setCompletedHabits(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading habits:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem(`habits_${todayKey}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCompletedHabits(parsed);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodayHabits();
  }, []);

  const handleBack = () => {
    setLocation("/cards");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "May Allah bless your continued journey.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again.",
      });
    }
  };

  const toggleHabit = async (habitId: string) => {
    let newCompleted: string[];
    
    if (completedHabits.includes(habitId)) {
      // Remove habit
      newCompleted = completedHabits.filter(id => id !== habitId);
    } else {
      // Add habit
      newCompleted = [...completedHabits, habitId];
    }

    setCompletedHabits(newCompleted);

    // Save to backend and localStorage
    try {
      await apiRequest('/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          completedHabits: newCompleted
        })
      });

      toast({
        title: "Progress saved!",
        description: getProgressMessage(newCompleted.length),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Saved locally",
        description: "Your progress will sync when connection is restored.",
      });
    }
    
    // Always store locally as well
    const todayKey = getTodayKey();
    localStorage.setItem(`habits_${todayKey}`, JSON.stringify(newCompleted));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading your journey...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 relative overflow-hidden animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #020617 100%)'
      }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button
          onClick={() => setLocation('/notification-settings')}
          className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
          title="Notification Settings"
        >
          <Bell className="w-5 h-5 text-purple-400" />
        </button>
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-slate-400 hover:text-red-400" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              My Journey
            </span>
          </h1>
          <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Small steps, big growth. Track your daily spiritual habits with love and grace.
          </p>
        </div>

        {/* User Greeting */}
        <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-lg text-slate-300">
            Assalamu alaikum, <span className="text-purple-400 font-medium">{user?.name}</span>
          </p>
        </div>

        {/* Progress Ring */}
        <div className="text-center mb-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <ProgressRing completed={completedHabits.length} total={6} />
          <p className="text-lg text-slate-300 font-medium">
            {getProgressMessage(completedHabits.length)}
          </p>
        </div>

        {/* Daily Habits */}
        <div className="space-y-4 animate-slide-up mb-8" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-2xl font-bold text-slate-200 mb-6">Today's Spiritual Practices</h2>
          
          {DAILY_HABITS.map((habit, index) => {
            const isCompleted = completedHabits.includes(habit.id);
            
            return (
              <div
                key={habit.id}
                className={`group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 cursor-pointer transition-all duration-300 hover:border-purple-400/50 animate-scale-in ${
                  isCompleted ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50' : ''
                }`}
                style={{ animationDelay: `${0.05 * index}s` }}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-center gap-6">
                  {/* Emoji */}
                  <div className={`w-14 h-14 rounded-2xl bg-slate-700/50 flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'scale-110 bg-gradient-to-br from-purple-500/30 to-pink-500/30' : 'group-hover:scale-105'
                  } transition-all duration-300`}>
                    <span className="text-2xl">{habit.emoji}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-200 mb-1">
                      {habit.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {habit.description}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-purple-400 border-purple-400' 
                      : 'border-slate-400 group-hover:border-purple-400'
                  }`}>
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="flex items-center justify-center my-12 animate-slide-up" style={{ animationDelay: '0.18s' }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <div className="px-6">
            <div className="w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="col-span-full mb-6">
            <h2 className="text-2xl font-bold text-slate-200 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
                Explore & Learn
              </span>
            </h2>
          </div>
          {/* Salah Section */}
          <button
            onClick={() => setLocation("/pray")}
            className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🤲🏽</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-purple-400 transition-colors">Salah</h3>
                <p className="text-sm text-slate-400">Step-by-step guidance</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Learn and practice all 5 daily prayers with Arabic text, translations, and visual guidance.
            </p>
          </button>

          {/* Community Section */}
          <button
            onClick={() => setLocation("/community")}
            className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-400/50 transition-all duration-300 hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-green-400 transition-colors">Community</h3>
                <p className="text-sm text-slate-400">Connect & share</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect with fellow Muslims, share experiences, and grow together in faith.
            </p>
          </button>

          {/* Lingo Guide Section */}
          <button
            onClick={() => setLocation("/lingo-guide")}
            className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">Lingo Guide</h3>
                <p className="text-sm text-slate-400">Learn Islamic terms</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Understand essential Islamic terminology with clear definitions and context.
            </p>
          </button>
        </div>

        {/* Encouraging Footer */}
        <div className="text-center mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Remember: Islam is a journey, not a destination. Every small act done with intention (niyyah) 
            is beloved by Allah. Be gentle with yourself as you grow. 💙
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
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

export default function MyJourneyPage() {
  return <MyJourneyContent />;
}