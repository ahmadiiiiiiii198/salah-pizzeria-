// Service Worker for Order Dashboard
// Handles background notifications and keeps the app running even when screen is off

const CACHE_NAME = 'order-dashboard-v1';
const urlsToCache = [
  '/',
  '/orders',
  '/admin',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('📦 Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🔄 Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Try to fetch from network
        return fetch(event.request).catch((error) => {
          console.log('🌐 Network fetch failed for:', event.request.url, error.message);

          // Return a basic response for favicon requests to prevent errors
          if (event.request.url.includes('favicon.ico')) {
            return new Response('', { status: 404, statusText: 'Not Found' });
          }

          // For other requests, throw the error
          throw error;
        });
      })
      .catch((error) => {
        console.log('🔄 Cache and network both failed for:', event.request.url);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

// Background sync for order updates
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  }
});

// Push notifications for new orders
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received:', event);
  
  let notificationData = {
    title: 'New Order Received!',
    body: 'You have a new flower order',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'new-order',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ],
    data: {
      url: '/orders',
      timestamp: Date.now()
    }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        title: `New Order #${data.orderNumber}`,
        body: `Order from ${data.customerName} - ${data.amount}`,
        data: {
          ...notificationData.data,
          orderId: data.orderId,
          orderNumber: data.orderNumber
        }
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    // Open the order dashboard
    event.waitUntil(
      clients.openWindow('/orders')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/orders') && 'focus' in client) {
            return client.focus();
          }
        }
        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow('/orders');
        }
      })
    );
  }
});

// Background message handling
self.addEventListener('message', (event) => {
  console.log('💬 Message received in SW:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'NEW_ORDER') {
    // Handle new order notification
    const { orderNumber, customerName, amount } = event.data;
    
    self.registration.showNotification(`New Order #${orderNumber}`, {
      body: `Order from ${customerName} - ${amount}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'new-order',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      actions: [
        {
          action: 'accept',
          title: 'Accept Order',
          icon: '/icons/accept.png'
        },
        {
          action: 'view',
          title: 'View Details',
          icon: '/icons/view.png'
        }
      ],
      data: {
        orderId: event.data.orderId,
        orderNumber: orderNumber,
        url: '/orders'
      }
    });
  }
});

// Background notification sound management
let backgroundAudio = null;
let isBackgroundSoundPlaying = false;
let notificationCheckInterval = null;

// Initialize background audio
function initBackgroundAudio() {
  if (!backgroundAudio) {
    // Create audio context for background playback
    backgroundAudio = new Audio('/notification-sound.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.8;
    console.log('🔊 [SW] Background audio initialized');
  }
}

// Play notification sound in background
async function playBackgroundNotificationSound() {
  try {
    initBackgroundAudio();

    if (!isBackgroundSoundPlaying && backgroundAudio) {
      console.log('🔊 [SW] Starting background notification sound...');
      isBackgroundSoundPlaying = true;

      // Try to play the sound
      try {
        await backgroundAudio.play();
        console.log('🔊 [SW] Background sound started successfully');
      } catch (playError) {
        console.log('🔊 [SW] Audio play failed (browser restrictions):', playError.message);
        // Fallback: send message to main thread to play sound
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'PLAY_NOTIFICATION_SOUND',
              data: { background: true }
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('🔊 [SW] Background sound error:', error);
  }
}

// Stop background notification sound
function stopBackgroundNotificationSound() {
  if (backgroundAudio && isBackgroundSoundPlaying) {
    console.log('🔊 [SW] Stopping background notification sound...');
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    isBackgroundSoundPlaying = false;
  }
}

// Check for new notifications in background
async function checkForNewNotifications() {
  try {
    console.log('🔔 [SW] Checking for new notifications in background...');

    // Send message to main thread to check notifications
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      clients.forEach(client => {
        client.postMessage({
          type: 'CHECK_NOTIFICATIONS',
          data: { background: true }
        });
      });
    } else {
      console.log('🔔 [SW] No active clients, skipping notification check');
    }

  } catch (error) {
    console.error('🔔 [SW] Background notification check failed:', error);
  }
}

// Periodic background sync to check for new orders
async function syncOrders() {
  try {
    console.log('🔄 [SW] Syncing orders in background...');

    // Check for new notifications
    await checkForNewNotifications();

    console.log('✅ [SW] Order sync completed');

  } catch (error) {
    console.error('❌ [SW] Order sync failed:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('📨 [SW] Received message:', event.data);

  const { type, data } = event.data;

  switch (type) {
    case 'START_BACKGROUND_SOUND':
      console.log('🔊 [SW] Starting background sound from main thread');
      playBackgroundNotificationSound();
      break;

    case 'STOP_BACKGROUND_SOUND':
      console.log('🔊 [SW] Stopping background sound from main thread');
      stopBackgroundNotificationSound();
      break;

    case 'NEW_NOTIFICATION':
      console.log('🔔 [SW] New notification received, starting sound');
      playBackgroundNotificationSound();

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        self.registration.showNotification('🔔 Nuovo Ordine!', {
          body: data.message || 'Hai ricevuto un nuovo ordine',
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'new-order',
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'Visualizza'
            },
            {
              action: 'dismiss',
              title: 'Ignora'
            }
          ]
        });
      }
      break;

    case 'ENABLE_BACKGROUND_SYNC':
      console.log('🔄 [SW] Enabling background sync');
      startBackgroundSync();
      break;

    case 'DISABLE_BACKGROUND_SYNC':
      console.log('🔄 [SW] Disabling background sync');
      stopBackgroundSync();
      break;
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 [SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    // Open the admin page
    event.waitUntil(
      clients.openWindow('/admin')
    );
  }
});

// Background sync management
function startBackgroundSync() {
  if (!notificationCheckInterval) {
    console.log('🔄 [SW] Starting background notification check (every 30 seconds)');
    notificationCheckInterval = setInterval(() => {
      checkForNewNotifications();
    }, 30000); // Check every 30 seconds
  }
}

function stopBackgroundSync() {
  if (notificationCheckInterval) {
    console.log('🔄 [SW] Stopping background notification check');
    clearInterval(notificationCheckInterval);
    notificationCheckInterval = null;
  }
}

// Keep the service worker alive
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'order-check') {
    event.waitUntil(syncOrders());
  }
});

// Start background sync when service worker activates
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🔄 Service Worker activated');
      // Start background sync
      startBackgroundSync();
      return self.clients.claim();
    })
  );
});

// Handle app visibility changes
self.addEventListener('visibilitychange', (event) => {
  console.log('👁️ App visibility changed:', document.hidden);
  
  if (document.hidden) {
    // App went to background - ensure notifications continue
    console.log('📱 App backgrounded - maintaining notification service');
  } else {
    // App came to foreground
    console.log('📱 App foregrounded - syncing data');
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  // Prevent the default unhandled rejection behavior
  event.preventDefault();

  // Only log non-fetch related errors to reduce noise
  if (!event.reason?.message?.includes('Failed to fetch')) {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
  }
});

console.log('🚀 Service Worker loaded and ready for order notifications!');
