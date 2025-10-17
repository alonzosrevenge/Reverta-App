// Service Worker for Push Notifications - Reverta Spiritual App

const CACHE_NAME = 'reverta-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event handler
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Reverta', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || 'Reverta - Spiritual Reminder',
    body: data.body || 'Remember Allah in your daily journey',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'reverta-spiritual',
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon.ico'
      }
    ],
    requireInteraction: false,
    silent: false,
    vibrate: [100, 50, 100], // Gentle vibration pattern
    image: data.image
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app is not already open
        if (clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/';
          return clients.openWindow(self.location.origin + targetUrl);
        }
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'spiritual-reminder') {
    event.waitUntil(
      // Handle background sync for spiritual reminders
      handleBackgroundSync()
    );
  }
});

function handleBackgroundSync() {
  // Implement any offline spiritual reminder logic here
  return Promise.resolve();
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});