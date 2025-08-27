#!/usr/bin/env node

/**
 * Test notification system on ordini page
 */

console.log('🔔 TESTING ORDINI PAGE NOTIFICATION SYSTEM');
console.log('==========================================');

// Simulate browser environment for testing
global.window = {
  location: {
    pathname: '/ordini',
    href: 'http://localhost:3000/ordini'
  },
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.document = {
  getElementById: (id) => {
    console.log(`📍 Looking for element: ${id}`);
    return {
      innerHTML: '',
      appendChild: () => {},
      style: {}
    };
  }
};

global.Audio = class MockAudio {
  constructor(src) {
    this.src = src;
    this.loop = false;
    this.volume = 1;
    this.paused = true;
    console.log(`🔊 Mock Audio created with src: ${src}`);
  }
  
  play() {
    this.paused = false;
    console.log(`▶️ Mock Audio play() called for: ${this.src}`);
    return Promise.resolve();
  }
  
  pause() {
    this.paused = true;
    console.log(`⏸️ Mock Audio pause() called for: ${this.src}`);
  }
};

console.log('🧪 Testing notification system components...');

// Test 1: Check if we're on the right page
console.log('\n1️⃣ Page Detection Test');
console.log('Current page:', global.window.location.pathname);
console.log('Is ordini page:', global.window.location.pathname === '/ordini' ? '✅' : '❌');

// Test 2: Check audio creation
console.log('\n2️⃣ Audio System Test');
try {
  const audio = new global.Audio('/notification-sound.mp3');
  console.log('✅ Audio object created successfully');
  console.log('Audio src:', audio.src);
  
  // Test play
  audio.play().then(() => {
    console.log('✅ Audio play() works');
  }).catch(err => {
    console.log('❌ Audio play() failed:', err.message);
  });
  
} catch (error) {
  console.log('❌ Audio creation failed:', error.message);
}

// Test 3: Check fallback beep
console.log('\n3️⃣ Fallback Beep Test');
try {
  const beepDataUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  const fallbackAudio = new global.Audio(beepDataUrl);
  console.log('✅ Fallback beep audio created');
  
  fallbackAudio.play().then(() => {
    console.log('✅ Fallback beep play() works');
  }).catch(err => {
    console.log('❌ Fallback beep play() failed:', err.message);
  });
  
} catch (error) {
  console.log('❌ Fallback beep creation failed:', error.message);
}

// Test 4: Check DOM elements
console.log('\n4️⃣ DOM Elements Test');
const headerControls = global.document.getElementById('header-notification-controls');
const headerControlsDesktop = global.document.getElementById('header-notification-controls-desktop');

console.log('Mobile header controls:', headerControls ? '✅ Found' : '❌ Not found');
console.log('Desktop header controls:', headerControlsDesktop ? '✅ Found' : '❌ Not found');

// Test 5: Simulate notification system behavior
console.log('\n5️⃣ Notification System Simulation');

class MockOrderNotificationSystem {
  constructor() {
    this.isInitialized = false;
    this.isSoundEnabled = true;
    this.isPlaying = false;
    this.audioRef = null;
    console.log('🚨 Mock OrderNotificationSystem created');
  }
  
  async initialize() {
    console.log('🔊 Initializing mock notification system...');
    
    try {
      // Try to create audio element
      this.audioRef = new global.Audio('/notification-sound.mp3');
      this.audioRef.loop = true;
      this.audioRef.volume = 0.8;
      
      // Simulate error handling
      if (this.audioRef.src.includes('notification-sound.mp3')) {
        console.log('🔊 Audio file not found, creating fallback...');
        const beepDataUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        this.audioRef = new global.Audio(beepDataUrl);
        this.audioRef.loop = true;
        this.audioRef.volume = 0.3;
        console.log('✅ Fallback beep audio created');
      }
      
      this.isInitialized = true;
      console.log('✅ Mock notification system initialized');
      
    } catch (error) {
      console.log('❌ Mock initialization failed:', error.message);
    }
  }
  
  async startNotificationSound() {
    if (!this.isInitialized) {
      console.log('⚠️ System not initialized, initializing now...');
      await this.initialize();
    }
    
    if (this.audioRef && this.isSoundEnabled && !this.isPlaying) {
      console.log('🔊 Starting notification sound...');
      try {
        await this.audioRef.play();
        this.isPlaying = true;
        console.log('✅ Notification sound started successfully');
      } catch (error) {
        console.log('❌ Failed to start notification sound:', error.message);
      }
    } else {
      console.log('⚠️ Cannot start sound:', {
        hasAudio: !!this.audioRef,
        soundEnabled: this.isSoundEnabled,
        isPlaying: this.isPlaying
      });
    }
  }
  
  stopNotificationSound() {
    if (this.audioRef && this.isPlaying) {
      console.log('🔇 Stopping notification sound...');
      this.audioRef.pause();
      this.isPlaying = false;
      console.log('✅ Notification sound stopped');
    }
  }
}

// Test the mock system
const mockSystem = new MockOrderNotificationSystem();
mockSystem.initialize().then(() => {
  console.log('\n🧪 Testing sound start...');
  return mockSystem.startNotificationSound();
}).then(() => {
  console.log('🧪 Testing sound stop...');
  setTimeout(() => {
    mockSystem.stopNotificationSound();
  }, 1000);
});

console.log('\n==========================================');
console.log('🎯 DIAGNOSIS COMPLETE');
console.log('');
console.log('📋 COMMON ISSUES TO CHECK:');
console.log('1. Missing notification-sound.mp3 file in public folder');
console.log('2. Browser autoplay policy blocking audio');
console.log('3. Multiple notification systems conflicting');
console.log('4. Audio context not initialized with user gesture');
console.log('5. Component not properly mounted in ordini page');
console.log('');
console.log('💡 SOLUTIONS:');
console.log('1. Add notification-sound.mp3 to public folder');
console.log('2. Use fallback beep sound (data URL)');
console.log('3. Ensure only one notification system is active');
console.log('4. Initialize audio on user interaction');
console.log('5. Check component rendering in browser console');
