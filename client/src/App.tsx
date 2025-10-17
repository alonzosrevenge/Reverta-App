import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Cards from "@/pages/cards";
import LingoGuide from "@/pages/lingo-guide";
import Pray from "@/pages/pray";
import MyJourney from "@/pages/my-journey";
import Fajr from "@/pages/fajr";
import Dhuhr from "@/pages/dhuhr";
import Asr from "@/pages/asr";
import Maghrib from "@/pages/maghrib";
import Isha from "@/pages/isha";
import NotificationSettings from "@/pages/notification-settings";
import Community from "@/pages/community";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/cards">
        <ProtectedRoute>
          <Cards />
        </ProtectedRoute>
      </Route>
      <Route path="/lingo-guide">
        <ProtectedRoute>
          <LingoGuide />
        </ProtectedRoute>
      </Route>
      <Route path="/pray">
        <ProtectedRoute>
          <Pray />
        </ProtectedRoute>
      </Route>
      <Route path="/my-journey">
        <ProtectedRoute>
          <MyJourney />
        </ProtectedRoute>
      </Route>
      <Route path="/fajr">
        <ProtectedRoute>
          <Fajr />
        </ProtectedRoute>
      </Route>
      <Route path="/dhuhr">
        <ProtectedRoute>
          <Dhuhr />
        </ProtectedRoute>
      </Route>
      <Route path="/asr">
        <ProtectedRoute>
          <Asr />
        </ProtectedRoute>
      </Route>
      <Route path="/maghrib">
        <ProtectedRoute>
          <Maghrib />
        </ProtectedRoute>
      </Route>
      <Route path="/isha">
        <ProtectedRoute>
          <Isha />
        </ProtectedRoute>
      </Route>
      <Route path="/notification-settings">
        <ProtectedRoute>
          <NotificationSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/community">
        <ProtectedRoute>
          <Community />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
