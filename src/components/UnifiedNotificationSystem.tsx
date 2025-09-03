import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, VolumeX, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OrderNotification {
  id: string;
  order_id: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  title?: string;
  is_acknowledged?: boolean;
}

const UnifiedNotificationSystem = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userManuallyStopped, setUserManuallyStopped] = useState(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [backgroundNotificationsEnabled, setBackgroundNotificationsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Service Worker and Background Notifications Setup
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('📱 [UnifiedNotification] Registering service worker...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        setServiceWorkerRegistration(registration);
        console.log('📱 [UnifiedNotification] Service worker registered successfully');

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('📨 [UnifiedNotification] Message from SW:', event.data);

          const { type } = event.data;

          switch (type) {
            case 'PLAY_NOTIFICATION_SOUND':
              console.log('🔊 [UnifiedNotification] SW requested sound play');
              if (isSoundEnabled && !userManuallyStopped) {
                startNotificationSound();
              }
              break;

            case 'CHECK_NOTIFICATIONS':
              console.log('🔔 [UnifiedNotification] SW requested notification check');
              fetchNotifications();
              break;
          }
        });

        return registration;
      } catch (error) {
        console.error('📱 [UnifiedNotification] Service worker registration failed:', error);
        return null;
      }
    } else {
      console.log('📱 [UnifiedNotification] Service workers not supported');
      return null;
    }
  }, [isSoundEnabled, userManuallyStopped]);

  // Request notification permission and enable background notifications
  const enableBackgroundNotifications = useCallback(async () => {
    try {
      console.log('🔔 [UnifiedNotification] Requesting notification permission...');

      // Request notification permission
      const permission = await Notification.requestPermission();
      console.log('🔔 [UnifiedNotification] Notification permission:', permission);

      if (permission === 'granted') {
        setBackgroundNotificationsEnabled(true);

        // Enable background sync in service worker
        if (serviceWorkerRegistration) {
          serviceWorkerRegistration.active?.postMessage({
            type: 'ENABLE_BACKGROUND_SYNC'
          });
        }

        console.log('✅ [UnifiedNotification] Background notifications enabled');
        return true;
      } else {
        console.log('❌ [UnifiedNotification] Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('❌ [UnifiedNotification] Failed to enable background notifications:', error);
      return false;
    }
  }, [serviceWorkerRegistration]);

  // Send notification to service worker
  const sendNotificationToServiceWorker = useCallback((message: string) => {
    if (serviceWorkerRegistration && backgroundNotificationsEnabled) {
      console.log('📨 [UnifiedNotification] Sending notification to SW:', message);
      serviceWorkerRegistration.active?.postMessage({
        type: 'NEW_NOTIFICATION',
        data: { message }
      });
    }
  }, [serviceWorkerRegistration, backgroundNotificationsEnabled]);

  // Generate a pleasant bell tone using Web Audio API
  const generateBellTone = (): string => {
    try {
      // Create a more pleasant bell-like sound using multiple frequencies
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 1.5; // 1.5 seconds
      const length = sampleRate * duration;
      const buffer = audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      // Create a bell-like sound with multiple harmonics
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        // Fundamental frequency (800 Hz - pleasant notification tone)
        const fundamental = Math.sin(2 * Math.PI * 800 * t);
        // Second harmonic (1600 Hz)
        const second = Math.sin(2 * Math.PI * 1600 * t) * 0.5;
        // Third harmonic (2400 Hz)
        const third = Math.sin(2 * Math.PI * 2400 * t) * 0.25;

        // Envelope to make it sound like a bell (quick attack, slow decay)
        const envelope = Math.exp(-t * 3);

        // Combine harmonics with envelope
        data[i] = (fundamental + second + third) * envelope * 0.3;
      }

      // Convert to WAV data URL
      const wav = audioBufferToWav(buffer);
      return URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
    } catch (error) {
      console.error('🔊 [UnifiedNotification] Error generating bell tone:', error);
      // Fallback to simple beep
      return 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAC/hYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    }
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const data = buffer.getChannelData(0);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return arrayBuffer;
  };

  // Simple audio initialization
  useEffect(() => {
    console.log('🔊 [UnifiedNotification] Initializing...');
    console.log('🔊 [UnifiedNotification] Component mounted on:', window.location.href);
    console.log('🔊 [UnifiedNotification] Timestamp:', new Date().toISOString());
    
    // Create audio element with pleasant bell sound
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.8;

    // Use the generated pleasant bell tone
    console.log('🔊 [UnifiedNotification] Using generated pleasant bell tone');
    audio.src = generateBellTone();

    // Fallback: if generated tone fails, use Web Audio API fallback
    audio.onerror = () => {
      console.log('🔊 [UnifiedNotification] Generated tone failed, using Web Audio API fallback');
      // We'll handle this in the startSound function
    };
    
    audioRef.current = audio;
    setIsInitialized(true);
    
    // Register service worker for background notifications
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('📱 [UnifiedNotification] Service worker ready, requesting notification permission...');
        // Auto-enable background notifications for admin pages
        if (window.location.pathname.includes('/admin')) {
          enableBackgroundNotifications();
        }
      }
    });

    // Initial check
    fetchNotifications();

    // Setup real-time subscription
    setupRealtimeSubscription();
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('📡 [UnifiedNotification] Fetching notifications...');
      console.log('📡 [UnifiedNotification] Current state:', {
        isSoundEnabled,
        isPlaying,
        isInitialized,
        currentURL: window.location.href,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase
        .from('order_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ [UnifiedNotification] Database fetch error:', error);
        console.error('❌ [UnifiedNotification] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });

        // Check if it's an RLS policy issue
        if (error.message.includes('row-level security policy')) {
          console.log('🔧 [UnifiedNotification] RLS POLICY ISSUE DETECTED!');
          console.log('📋 [UnifiedNotification] Notifications table has RLS policies blocking access');
          setError('RLS policies need fixing - notifications blocked');
        } else {
          setError(`Database error: ${error.message}`);
        }
        return;
      }

      const newNotifications = data || [];
      setNotifications(newNotifications);

      console.log(`📊 [UnifiedNotification] Found ${newNotifications.length} notifications`);
      console.log('📊 [UnifiedNotification] Notifications:', newNotifications.map(n => ({
        id: n.id,
        message: n.message,
        created_at: n.created_at
      })));

      // Start sound ONLY if there are NEW notifications AND user hasn't manually stopped
      const hasNewNotifications = newNotifications.length > notifications.length;

      if (hasNewNotifications && newNotifications.length > 0 && isSoundEnabled && !isPlaying && !userManuallyStopped) {
        console.log('🔊 [UnifiedNotification] TRIGGERING SOUND - NEW notifications detected:');
        console.log('  - New notifications found:', newNotifications.length);
        console.log('  - Previous count:', notifications.length);
        console.log('  - Sound enabled:', isSoundEnabled);
        console.log('  - Not already playing:', !isPlaying);
        console.log('  - User manually stopped:', userManuallyStopped);

        // Start sound in main thread
        startSound();

        // Also send to service worker for background notifications
        const latestNotification = newNotifications[0];
        const message = `Nuovo ordine da ${latestNotification.metadata?.customer_name || 'Cliente'}`;
        sendNotificationToServiceWorker(message);
      } else {
        console.log('🔇 [UnifiedNotification] NOT TRIGGERING SOUND - Conditions:');
        console.log('  - New notifications found:', newNotifications.length);
        console.log('  - Previous count:', notifications.length);
        console.log('  - Has new notifications:', hasNewNotifications);
        console.log('  - Sound enabled:', isSoundEnabled);
        console.log('  - Not already playing:', !isPlaying);
        console.log('  - User manually stopped:', userManuallyStopped);

        if (newNotifications.length === 0) {
          console.log('📊 [UnifiedNotification] No unread notifications found');
        } else if (!hasNewNotifications) {
          console.log('📊 [UnifiedNotification] No NEW notifications (same count as before)');
        } else if (userManuallyStopped) {
          console.log('🔇 [UnifiedNotification] User manually stopped sound - not auto-restarting');
        } else if (!isSoundEnabled) {
          console.log('🔇 [UnifiedNotification] Sound disabled, not playing');
        } else if (isPlaying) {
          console.log('🔊 [UnifiedNotification] Sound already playing');
        }
      }

    } catch (error) {
      console.error('❌ [UnifiedNotification] Unexpected fetch error:', error);
      setError(`Fetch error: ${error.message}`);
    }
  }, [isSoundEnabled, isPlaying, isInitialized]);

  // Setup real-time subscription
  const setupRealtimeSubscription = useCallback(() => {
    console.log('📡 [UnifiedNotification] Setting up real-time subscription...');

    try {
      const subscription = supabase
        .channel('unified_notifications')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'order_notifications' },
          (payload) => {
            console.log('📡 [UnifiedNotification] 🚨 NEW NOTIFICATION VIA REAL-TIME! 🚨');
            console.log('📡 [UnifiedNotification] Payload:', payload);
            console.log('📡 [UnifiedNotification] Real-time payload details:', {
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
              schema: payload.schema,
              table: payload.table,
              timestamp: new Date().toISOString()
            });
            console.log('📡 [UnifiedNotification] Triggering fetchNotifications...');

            // Reset manual stop flag for new real-time notifications
            setUserManuallyStopped(false);

            fetchNotifications();
          }
        )
        .subscribe((status) => {
          console.log('📡 [UnifiedNotification] Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ [UnifiedNotification] Real-time subscription active');
            setError(null); // Clear any previous errors
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ [UnifiedNotification] Real-time subscription error');
            setError('Real-time subscription failed - notifications may not work');
          } else if (status === 'TIMED_OUT') {
            console.warn('⚠️ [UnifiedNotification] Real-time subscription timed out');
            setError('Real-time subscription timed out - using polling only');
          } else if (status === 'CLOSED') {
            console.warn('⚠️ [UnifiedNotification] Real-time subscription closed');
            setError('Real-time subscription closed - using polling only');

            // Try to reconnect after 5 seconds
            setTimeout(() => {
              console.log('🔄 [UnifiedNotification] Attempting to reconnect real-time...');
              setupRealtimeSubscription();
            }, 5000);
          }
        });

      subscriptionRef.current = subscription;

      // Backup polling every 30 seconds
      intervalRef.current = setInterval(() => {
        console.log('📡 [UnifiedNotification] Polling backup...');
        fetchNotifications();

        // Also check for recent orders without notifications
        checkOrdersWithoutNotifications();
      }, 30000);

    } catch (error) {
      console.error('❌ [UnifiedNotification] Subscription setup error:', error);
      setError(`Subscription error: ${error.message}`);
    }

  }, [fetchNotifications]);

  // Check for orders without notifications
  const checkOrdersWithoutNotifications = useCallback(async () => {
    try {
      console.log('🔍 [UnifiedNotification] Checking for orders without notifications...');

      // Get recent orders (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: recentOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, created_at')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) {
        console.error('❌ [UnifiedNotification] Error checking orders:', ordersError);
        return;
      }

      if (recentOrders && recentOrders.length > 0) {
        console.log(`📊 [UnifiedNotification] Found ${recentOrders.length} recent orders`);

        // Check which orders have notifications
        for (const order of recentOrders) {
          const { data: orderNotifications, error: notifError } = await supabase
            .from('order_notifications')
            .select('id')
            .eq('order_id', order.id);

          if (notifError) {
            console.error(`❌ [UnifiedNotification] Error checking notifications for order ${order.order_number}:`, notifError);
          } else if (!orderNotifications || orderNotifications.length === 0) {
            console.warn(`⚠️ [UnifiedNotification] Order ${order.order_number} has NO NOTIFICATION!`);
            console.warn(`   Customer: ${order.customer_name}, Created: ${order.created_at}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ [UnifiedNotification] Error in checkOrdersWithoutNotifications:', error);
    }
  }, []);

  // Start notification sound
  const startSound = useCallback(async () => {
    console.log('🔊 [UnifiedNotification] startSound called');
    console.log('🔊 [UnifiedNotification] Audio state:', {
      hasAudioRef: !!audioRef.current,
      isSoundEnabled,
      isPlaying,
      audioSrc: audioRef.current?.src,
      audioVolume: audioRef.current?.volume,
      audioLoop: audioRef.current?.loop
    });

    if (!audioRef.current) {
      console.error('❌ [UnifiedNotification] No audio reference available');
      setError('Audio not initialized');
      return;
    }

    if (!isSoundEnabled) {
      console.log('🔇 [UnifiedNotification] Sound disabled, not playing');
      return;
    }

    if (isPlaying) {
      console.log('🔊 [UnifiedNotification] Sound already playing');
      return;
    }

    try {
      console.log('🔊 [UnifiedNotification] Starting sound...');
      setIsPlaying(true);

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ [UnifiedNotification] Sound started successfully');
            setError(null); // Clear any previous errors
          })
          .catch(error => {
            console.error('❌ [UnifiedNotification] Sound play error:', error);
            console.error('❌ [UnifiedNotification] Error details:', {
              name: error.name,
              message: error.message,
              code: error.code
            });

            // Try Web Audio API fallback
            console.log('🔊 [UnifiedNotification] Trying Web Audio API fallback...');
            tryWebAudioFallback();
          });
      }
    } catch (error) {
      console.error('❌ [UnifiedNotification] Start sound error:', error);
      console.log('🔊 [UnifiedNotification] Trying Web Audio API fallback...');
      tryWebAudioFallback();
    }

    // Web Audio API fallback function - creates a pleasant bell-like sound
    function tryWebAudioFallback() {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create a bell-like sound with multiple harmonics
        const playBellSound = () => {
          const duration = 1.5;
          const fundamental = audioContext.createOscillator();
          const second = audioContext.createOscillator();
          const third = audioContext.createOscillator();

          const fundamentalGain = audioContext.createGain();
          const secondGain = audioContext.createGain();
          const thirdGain = audioContext.createGain();
          const masterGain = audioContext.createGain();

          // Connect oscillators to their gain nodes
          fundamental.connect(fundamentalGain);
          second.connect(secondGain);
          third.connect(thirdGain);

          // Connect gain nodes to master gain
          fundamentalGain.connect(masterGain);
          secondGain.connect(masterGain);
          thirdGain.connect(masterGain);

          // Connect master gain to destination
          masterGain.connect(audioContext.destination);

          // Set frequencies for bell-like harmonics
          fundamental.frequency.setValueAtTime(800, audioContext.currentTime);
          second.frequency.setValueAtTime(1600, audioContext.currentTime);
          third.frequency.setValueAtTime(2400, audioContext.currentTime);

          // Set oscillator types
          fundamental.type = 'sine';
          second.type = 'sine';
          third.type = 'sine';

          // Set relative volumes for harmonics
          fundamentalGain.gain.setValueAtTime(0.4, audioContext.currentTime);
          secondGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          thirdGain.gain.setValueAtTime(0.1, audioContext.currentTime);

          // Create bell-like envelope (quick attack, slow decay)
          masterGain.gain.setValueAtTime(0, audioContext.currentTime);
          masterGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
          masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

          // Start and stop all oscillators
          const startTime = audioContext.currentTime;
          const stopTime = startTime + duration;

          fundamental.start(startTime);
          second.start(startTime);
          third.start(startTime);

          fundamental.stop(stopTime);
          second.stop(stopTime);
          third.stop(stopTime);
        };

        // Play the initial bell sound
        playBellSound();
        console.log('✅ [UnifiedNotification] Web Audio API bell fallback successful');
        setError(null);

        // Repeat the bell every 2 seconds while playing
        const bellInterval = setInterval(() => {
          if (!isPlaying) {
            clearInterval(bellInterval);
            return;
          }

          try {
            playBellSound();
          } catch (bellError) {
            console.error('❌ [UnifiedNotification] Bell repeat error:', bellError);
            clearInterval(bellInterval);
          }
        }, 2000);

      } catch (webAudioError) {
        console.error('❌ [UnifiedNotification] Web Audio API fallback failed:', webAudioError);
        setError('Audio not supported in this browser');
        setIsPlaying(false);
      }
    }
  }, [isSoundEnabled, isPlaying]);

  // Stop notification sound
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      console.log('🔇 [UnifiedNotification] Stopping sound...');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('order_notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;

      setNotifications([]);

      // IMPORTANT: Stop sound when marking as read
      if (isPlaying) {
        stopSound();
      }

      console.log('✅ [UnifiedNotification] All notifications marked as read and sound stopped');
    } catch (error) {
      console.error('❌ [UnifiedNotification] Mark as read error:', error);
    }
  }, [isPlaying, stopSound]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    if (isPlaying) {
      console.log('🔇 [UnifiedNotification] User clicked STOP - stopping sound');
      setUserManuallyStopped(true); // Prevent auto-restart
      stopSound();
      // Also mark notifications as read when user manually stops
      markAllAsRead();
    } else if (notifications.length > 0) {
      console.log('🔊 [UnifiedNotification] User clicked PLAY - starting sound');
      setUserManuallyStopped(false); // Allow auto-restart for new notifications
      startSound();
    }
  }, [isPlaying, notifications.length, startSound, stopSound, markAllAsRead]);

  const unreadCount = notifications.length;

  if (!isInitialized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="p-3 bg-blue-100 text-blue-800 rounded-full shadow-lg">
          <Bell className="h-6 w-6 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Error display */}
      {error && (
        <div className="fixed top-16 right-4 z-50 max-w-sm">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">⚠️ {error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System status indicator */}
      <div className="fixed top-4 left-4 z-50">
        <div className={`px-3 py-2 rounded-lg shadow-lg text-xs font-bold ${
          error
            ? 'bg-red-100 text-red-800 border border-red-300'
            : isInitialized
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        }`}>
          {error
            ? '❌ NOTIFICATION ERROR'
            : isInitialized
            ? '✅ NOTIFICATION SYSTEM ACTIVE'
            : '⏳ INITIALIZING...'
          }
        </div>
      </div>

      {/* Floating notification button */}
      {(unreadCount > 0 || isPlaying) && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleSound}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              isPlaying
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
            title={isPlaying ? 'Stop notification sound' : 'Play notification sound'}
          >
            <div className="flex items-center space-x-2">
              {isPlaying ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              {unreadCount > 0 && (
                <span className="bg-white text-red-600 rounded-full px-2 py-1 text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Control buttons */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Main control button */}
        <button
          onClick={toggleSound}
          className={`px-4 py-2 rounded-lg shadow-lg font-bold text-sm transition-all duration-300 ${
            isPlaying
              ? 'bg-red-600 text-white animate-pulse'
              : unreadCount > 0
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {isPlaying ? '🔇 STOP SOUND' : unreadCount > 0 ? `🔊 PLAY (${unreadCount})` : '🔇 NO ALERTS'}
        </button>

        {/* Mark as read button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg font-bold text-sm hover:bg-green-700 transition-all duration-300"
          >
            ✅ MARK READ
          </button>
        )}

        {/* Background notifications toggle */}
        <button
          onClick={enableBackgroundNotifications}
          className={`px-3 py-1 rounded-lg shadow-lg text-xs transition-all duration-300 ${
            backgroundNotificationsEnabled
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
          title={backgroundNotificationsEnabled ? 'Notifiche in background attive' : 'Abilita notifiche in background'}
        >
          📱 {backgroundNotificationsEnabled ? 'BACKGROUND ON' : 'ENABLE BACKGROUND'}
        </button>

        {/* Test button */}
        <button
          onClick={() => {
            if (isPlaying) {
              stopSound();
            } else {
              startSound();
            }
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow-lg text-xs hover:bg-blue-600 transition-all duration-300"
        >
          🧪 TEST
        </button>

        {/* Manual notification trigger */}
        <button
          onClick={async () => {
            console.log('🧪 [UnifiedNotification] Manual notification trigger...');
            try {
              const { error } = await supabase
                .from('order_notifications')
                .insert({
                  order_id: null,
                  notification_type: 'test',
                  title: 'Test Notification!',
                  message: `Manual test at ${new Date().toLocaleTimeString()}`,
                  is_read: false,
                  is_acknowledged: false
                });

              if (error) {
                console.error('❌ [UnifiedNotification] Manual test failed:', error);
                setError(`Test failed: ${error.message}`);
              } else {
                console.log('✅ [UnifiedNotification] Manual test notification created');
              }
            } catch (err) {
              console.error('❌ [UnifiedNotification] Manual test error:', err);
            }
          }}
          className="px-3 py-1 bg-green-500 text-white rounded-lg shadow-lg text-xs hover:bg-green-600 transition-all duration-300"
        >
          ➕ CREATE
        </button>
      </div>
    </>
  );
};

export default UnifiedNotificationSystem;
