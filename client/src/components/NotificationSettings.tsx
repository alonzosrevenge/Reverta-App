import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Sun, Moon, Sunset, MessageSquareHeart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToNotifications, unsubscribeFromNotifications } from "@/lib/notifications";

interface NotificationPreferences {
  enabled: boolean;
  morningReminders: boolean;
  afternoonReminders: boolean;
  eveningReminders: boolean;
  prayerReminders: boolean;
  spiritualQuotes: boolean;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false,
    morningReminders: true,
    afternoonReminders: true,
    eveningReminders: true,
    prayerReminders: true,
    spiritualQuotes: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      loadPreferences();
    }
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await apiRequest("GET", "/api/notifications/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/notifications/preferences", newPreferences);

      if (response.ok) {
        setPreferences(newPreferences);
        toast({
          title: "Settings saved",
          description: "Your notification preferences have been updated."
        });
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        await subscribeToNotifications();
        const newPreferences = { ...preferences, enabled: true };
        await savePreferences(newPreferences);
        
        toast({
          title: "Notifications enabled! ✨",
          description: "You'll now receive gentle spiritual reminders throughout your day."
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings to receive spiritual reminders.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromNotifications();
      const newPreferences = { ...preferences, enabled: false };
      await savePreferences(newPreferences);
      
      toast({
        title: "Notifications disabled",
        description: "You will no longer receive push notifications."
      });
    } catch (error) {
      console.error("Failed to disable notifications:", error);
      toast({
        title: "Error",
        description: "Failed to disable notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    await savePreferences(newPreferences);
  };

  const sendTestNotification = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/notifications/test", {
        title: "Test Notification ✨",
        body: "This is a test notification from Reverta!"
      });

      if (response.ok) {
        toast({
          title: "Test sent!",
          description: "Check your notifications for the test message."
        });
      } else {
        throw new Error("Failed to send test notification");
      }
    } catch (error) {
      console.error("Failed to send test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <BellOff className="w-5 h-5" />
              Notifications Not Supported
            </CardTitle>
            <CardDescription>
              Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Toggle */}
      <Card className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive gentle spiritual reminders throughout your day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-200">Enable Notifications</p>
              <p className="text-sm text-slate-400">Get encouraging Islamic reminders</p>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={preferences.enabled ? handleDisableNotifications : handleEnableNotifications}
              disabled={isLoading}
            />
          </div>

          {preferences.enabled && (
            <div className="pt-4 border-t border-slate-700/50">
              <Button
                onClick={sendTestNotification}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
              >
                Send Test Notification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Types */}
      {preferences.enabled && (
        <Card className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Reminder Types</CardTitle>
            <CardDescription>
              Choose which types of spiritual reminders you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="font-medium text-slate-200">Morning Reflections</p>
                  <p className="text-sm text-slate-400">Start your day with gratitude and remembrance</p>
                </div>
              </div>
              <Switch
                checked={preferences.morningReminders}
                onCheckedChange={(value) => handlePreferenceChange('morningReminders', value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-slate-200">Afternoon Peace</p>
                  <p className="text-sm text-slate-400">Gentle midday reminders to pause and reconnect</p>
                </div>
              </div>
              <Switch
                checked={preferences.afternoonReminders}
                onCheckedChange={(value) => handlePreferenceChange('afternoonReminders', value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sunset className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium text-slate-200">Evening Reflection</p>
                  <p className="text-sm text-slate-400">End your day with gratitude and seeking forgiveness</p>
                </div>
              </div>
              <Switch
                checked={preferences.eveningReminders}
                onCheckedChange={(value) => handlePreferenceChange('eveningReminders', value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquareHeart className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="font-medium text-slate-200">Spiritual Quotes</p>
                  <p className="text-sm text-slate-400">Inspiring Islamic wisdom and encouragement</p>
                </div>
              </div>
              <Switch
                checked={preferences.spiritualQuotes}
                onCheckedChange={(value) => handlePreferenceChange('spiritualQuotes', value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card className="bg-slate-800/20 backdrop-blur-xl border-slate-700/30">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            Our notifications are designed to be gentle and encouraging, celebrating your spiritual journey without pressure. 
            You can adjust these settings anytime to match your personal spiritual rhythm.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}