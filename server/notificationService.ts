// Server-side notification service for sending push notifications
import webpush from 'web-push';
import { storage } from './storage';

// Configure web-push with VAPID keys
// In production, these should be stored as environment variables
const VAPID_PUBLIC_KEY = 'BGT2dhhQs-8H9P2PNSs-ZKiTlPFomhe27YrO1pXGKxX02_u3wVzUzlLxYAZm3D0syLEz-i_oAcU3rk-7nM2xF-E';
const VAPID_PRIVATE_KEY = 'l7YwZTOMnD9Y0eGywnp6erNx0xmLhUd0ZMDadzf9VSM'; // This should be from env
const VAPID_SUBJECT = 'mailto:support@reverta.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  tag?: string;
}

export class NotificationService {
  static async sendToUser(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const subscriptions = await storage.getUserPushSubscriptions(userId);
      
      if (subscriptions.length === 0) {
        console.log(`No push subscriptions found for user ${userId}`);
        return false;
      }

      const notificationPayload = {
  ...payload,
  title: payload.title,
  body: payload.body,
  icon: payload.icon || '/favicon.ico',
  badge: payload.badge || '/favicon.ico',
  tag: payload.tag || 'reverta-spiritual',
  url: payload.url || '/',
};

      let successCount = 0;
      
      for (const subscription of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dhKey,
              auth: subscription.authKey
            }
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(notificationPayload)
          );
          
          successCount++;
        } catch (error: any) {
          console.error(`Failed to send notification to subscription ${subscription.id}:`, error);
          
          // If subscription is invalid, remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`Removing invalid subscription for user ${userId}`);
            await storage.deletePushSubscription(userId);
          }
        }
      }

      return successCount > 0;
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error);
      return false;
    }
  }

  static async sendToAllUsers(payload: NotificationPayload, filterPreferences?: {
    morningReminders?: boolean;
    afternoonReminders?: boolean;
    eveningReminders?: boolean;
    spiritualQuotes?: boolean;
  }): Promise<number> {
    try {
      const usersWithNotifications = await storage.getAllUsersWithNotifications();
      let sentCount = 0;

      for (const { user, preferences, subscriptions } of usersWithNotifications) {
        // Apply preference filters if provided
        if (filterPreferences) {
          const hour = new Date().getHours();
          let shouldSend = false;

          if (hour >= 5 && hour < 12 && filterPreferences.morningReminders && preferences.morningReminders) {
            shouldSend = true;
          } else if (hour >= 12 && hour < 17 && filterPreferences.afternoonReminders && preferences.afternoonReminders) {
            shouldSend = true;
          } else if (hour >= 17 && filterPreferences.eveningReminders && preferences.eveningReminders) {
            shouldSend = true;
          } else if (filterPreferences.spiritualQuotes && preferences.spiritualQuotes) {
            shouldSend = true;
          }

          if (!shouldSend) continue;
        }

        const success = await this.sendToUser(user.id, payload);
        if (success) sentCount++;
      }

      return sentCount;
    } catch (error) {
      console.error('Error sending notifications to all users:', error);
      return 0;
    }
  }
}

// Spiritual messages for different times of day
export const SPIRITUAL_NOTIFICATION_MESSAGES = {
  morning: [
    {
      title: "☀️ Begin with Gratitude",
      body: "Alhamdulillahi rabbil alameen. Start your day remembering Allah's countless blessings."
    },
    {
      title: "🌅 Morning Light",
      body: "Allah has given you a new day. What small act of worship will you choose today?"
    },
    {
      title: "💝 Fresh Start",
      body: "Every sunrise is Allah's way of saying: yesterday is forgiven, today is a gift."
    },
    {
      title: "🤲 Peaceful Moment",
      body: "Take a deep breath and say 'Bismillah'. Allah is with you through every step."
    }
  ],
  afternoon: [
    {
      title: "🌸 Gentle Reminder",
      body: "Subhan'Allah - remember the One who created you with such care and love."
    },
    {
      title: "💫 Moment of Peace",
      body: "In your busy day, take a moment to say 'La hawla wa la quwwata illa billah'."
    },
    {
      title: "🌱 Growing Faith",
      body: "Small acts of remembrance are like drops that fill the ocean of your heart."
    },
    {
      title: "🕊️ Gentle Guidance",
      body: "Allah sees your efforts, even the smallest ones. You're doing beautifully."
    }
  ],
  evening: [
    {
      title: "🌙 Evening Reflection",
      body: "As the day ends, reflect on Allah's mercy that surrounded you today."
    },
    {
      title: "✨ Peaceful Night",
      body: "Say 'Astaghfirullah' - let go of today's mistakes and trust in Allah's forgiveness."
    },
    {
      title: "🌟 Quiet Gratitude",
      body: "Before sleep, whisper 'Alhamdulillah' for all the ways Allah protected you today."
    },
    {
      title: "💤 Restful Heart",
      body: "End your day with 'Rabbana atina fi'd-dunya hasanatan...' - a du'a for good in both worlds."
    }
  ]
};

// Helper function to get a random message for the current time
export function getTimeBasedSpiritualMessage(): NotificationPayload {
  const hour = new Date().getHours();
  let messages;

  if (hour >= 5 && hour < 12) {
    messages = SPIRITUAL_NOTIFICATION_MESSAGES.morning;
  } else if (hour >= 12 && hour < 17) {
    messages = SPIRITUAL_NOTIFICATION_MESSAGES.afternoon;
  } else {
    messages = SPIRITUAL_NOTIFICATION_MESSAGES.evening;
  }

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    ...randomMessage,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'reverta-spiritual-reminder',
    url: '/my-journey'
  };
}