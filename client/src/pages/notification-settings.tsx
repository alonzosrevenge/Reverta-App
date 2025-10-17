import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { NotificationSettings } from "@/components/NotificationSettings";

export default function NotificationSettingsPage() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/my-journey");
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      <div className="max-w-4xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Spiritual Reminders
            </span>
          </h1>
          <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Stay connected to Allah throughout your day with gentle, encouraging notifications
          </p>
        </div>

        {/* Notification Settings Component */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <NotificationSettings />
        </div>

        {/* Information Section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-slate-800/20 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              About Spiritual Reminders
            </h3>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong className="text-purple-400">Morning Reflections:</strong> Start your day with gratitude and remembrance of Allah's blessings.
              </p>
              <p>
                <strong className="text-purple-400">Afternoon Peace:</strong> Gentle midday reminders to pause and reconnect with your faith.
              </p>
              <p>
                <strong className="text-purple-400">Evening Reflection:</strong> End your day with gratitude and seeking Allah's forgiveness.
              </p>
              <p className="text-sm text-slate-400 mt-4">
                All notifications are designed to be gentle and encouraging, celebrating your spiritual journey without pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}