import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setLocation("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (!formData.gender) {
      toast({
        variant: "destructive",
        title: "Please select Brother or Sister",
        description: "This helps us provide a personalized experience.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(formData.email, formData.name, formData.password, formData.gender);
      toast({
        title: "Welcome to your spiritual journey!",
        description: "Account created and you're now signed in.",
      });
      // Small delay to ensure auth state has settled
      setTimeout(() => setLocation("/my-journey"), 150);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Begin Your Journey
            </span>
          </h1>
          <p className="text-lg text-slate-300 font-light">
            Create your account and start growing spiritually
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl animate-scale-in">
            
            {/* Name Field */}
            <div className="space-y-2 mb-6">
              <label className="text-slate-300 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 mb-6">
              <label className="text-slate-300 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 mb-6">
              <label className="text-slate-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password (min 6 characters)"
                  className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 mb-6">
              <label className="text-slate-300 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2 mb-8">
              <label className="text-slate-300 font-medium">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: 'Brother' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                    formData.gender === 'Brother'
                      ? 'border-purple-400 bg-purple-400/20 text-white'
                      : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-purple-400/50 hover:bg-slate-700/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Brother</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: 'Sister' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                    formData.gender === 'Sister'
                      ? 'border-purple-400 bg-purple-400/20 text-white'
                      : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-purple-400/50 hover:bg-slate-700/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Sister</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-black py-3 rounded-xl text-lg font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setLocation("/login")}
              className="text-purple-400 font-medium hover:text-pink-400 transition-colors"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-500/15 to-yellow-400/15 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-purple-500/15 rounded-full blur-2xl animate-pulse -z-10" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}