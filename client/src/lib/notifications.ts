// Push notification utilities for spiritual reminders

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return { granted: false, denied: true, default: false };
    }

    let permission = Notification.permission;
    
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BGT2dhhQs-8H9P2PNSs-ZKiTlPFomhe27YrO1pXGKxX02_u3wVzUzlLxYAZm3D0syLEz-i_oAcU3rk-7nM2xF-E' // VAPID public key
        )
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Notify server of unsubscription
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          credentials: 'include'
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    return await this.registration.pushManager.getSubscription();
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Local notification for immediate feedback
  showLocalNotification(title: string, body: string, icon?: string): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'reverta-spiritual',
        requireInteraction: false,
        silent: false
      });
    }
  }
}

// Spiritual notification messages
export const SPIRITUAL_MESSAGES = {
  morning: [
    {
      title: "☀️ Begin with Gratitude",
      body: "Alhamdulillahi rabbil alameen. Start your day remembering Allah's countless blessings.",
    },
    {
      title: "🌅 Morning Light",
      body: "Allah has given you a new day. What small act of worship will you choose today?",
    },
    {
      title: "💝 Fresh Start",
      body: "Every sunrise is Allah's way of saying: yesterday is forgiven, today is a gift.",
    },
    {
      title: "🤲 Peaceful Moment",
      body: "Take a deep breath and say 'Bismillah'. Allah is with you through every step.",
    }
  ],
  afternoon: [
    {
      title: "🌸 Gentle Reminder",
      body: "Subhan'Allah - remember the One who created you with such care and love.",
    },
    {
      title: "💫 Moment of Peace",
      body: "In your busy day, take a moment to say 'La hawla wa la quwwata illa billah'.",
    },
    {
      title: "🌱 Growing Faith",
      body: "Small acts of remembrance are like drops that fill the ocean of your heart.",
    },
    {
      title: "🕊️ Gentle Guidance",
      body: "Allah sees your efforts, even the smallest ones. You're doing beautifully.",
    }
  ],
  evening: [
    {
      title: "🌙 Evening Reflection",
      body: "As the day ends, reflect on Allah's mercy that surrounded you today.",
    },
    {
      title: "✨ Peaceful Night",
      body: "Say 'Astaghfirullah' - let go of today's mistakes and trust in Allah's forgiveness.",
    },
    {
      title: "🌟 Quiet Gratitude",
      body: "Before sleep, whisper 'Alhamdulillah' for all the ways Allah protected you today.",
    },
    {
      title: "💤 Restful Heart",
      body: "End your day with 'Rabbana atina fi'd-dunya hasanatan...' - a du'a for good in both worlds.",
    }
  ]
};

// Helper function to get appropriate message for time of day
export function getTimeBasedMessage(): { title: string; body: string } {
  const hour = new Date().getHours();
  let messages;

  if (hour >= 5 && hour < 12) {
    messages = SPIRITUAL_MESSAGES.morning;
  } else if (hour >= 12 && hour < 17) {
    messages = SPIRITUAL_MESSAGES.afternoon;
  } else {
    messages = SPIRITUAL_MESSAGES.evening;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

// Convenience functions for the notification settings component
export async function subscribeToNotifications(): Promise<boolean> {
  const service = PushNotificationService.getInstance();
  await service.initialize();
  const permission = await service.requestPermission();
  
  if (permission.granted) {
    const subscription = await service.subscribe();
    return subscription !== null;
  }
  
  return false;
}

export async function unsubscribeFromNotifications(): Promise<boolean> {
  const service = PushNotificationService.getInstance();
  return await service.unsubscribe();
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermission> {
  const service = PushNotificationService.getInstance();
  return await service.requestPermission();
}