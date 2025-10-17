import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setLocation("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to continue your journey.",
      });
      // Small delay to ensure auth state has settled
      setTimeout(() => setLocation("/my-journey"), 150);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
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
              Welcome Back
            </span>
          </h1>
          <p className="text-lg text-slate-300 font-light">
            Continue your spiritual journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl animate-scale-in">
            
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
            <div className="space-y-2 mb-8">
              <label className="text-slate-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-black py-3 rounded-xl text-lg font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-400">
            New to your spiritual journey?{' '}
            <button
              onClick={() => setLocation("/register")}
              className="text-purple-400 font-medium hover:text-pink-400 transition-colors"
            >
              Create an account
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