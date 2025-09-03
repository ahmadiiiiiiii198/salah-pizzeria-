// iOS Image Debug Utility
// Helps debug image loading issues on iPhone devices

export interface ImageDebugInfo {
  url: string;
  loaded: boolean;
  error: string | null;
  dimensions: { width: number; height: number } | null;
  loadTime: number | null;
  isIOS: boolean;
  userAgent: string;
  viewport: { width: number; height: number };
}

export class IOSImageDebugger {
  private static instance: IOSImageDebugger;
  private debugInfo: Map<string, ImageDebugInfo> = new Map();

  static getInstance(): IOSImageDebugger {
    if (!IOSImageDebugger.instance) {
      IOSImageDebugger.instance = new IOSImageDebugger();
    }
    return IOSImageDebugger.instance;
  }

  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  async testImageLoad(url: string): Promise<ImageDebugInfo> {
    const startTime = Date.now();
    const isIOS = this.isIOSDevice();
    
    const debugInfo: ImageDebugInfo = {
      url,
      loaded: false,
      error: null,
      dimensions: null,
      loadTime: null,
      isIOS,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    try {
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          debugInfo.loaded = true;
          debugInfo.dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight
          };
          debugInfo.loadTime = Date.now() - startTime;
          resolve();
        };
        
        img.onerror = (error) => {
          debugInfo.error = `Image load failed: ${error}`;
          reject(new Error(debugInfo.error));
        };
        
        // Set a timeout for iOS devices
        setTimeout(() => {
          if (!debugInfo.loaded) {
            debugInfo.error = 'Image load timeout (10s)';
            reject(new Error(debugInfo.error));
          }
        }, 10000);
        
        img.src = url;
      });
      
    } catch (error) {
      debugInfo.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.debugInfo.set(url, debugInfo);
    return debugInfo;
  }

  logDebugInfo(url: string): void {
    const info = this.debugInfo.get(url);
    if (!info) {
      console.warn(`No debug info found for URL: ${url}`);
      return;
    }

    console.group(`🖼️ Image Debug Info: ${url}`);
    console.log(`📱 iOS Device: ${info.isIOS ? '✅' : '❌'}`);
    console.log(`✅ Loaded: ${info.loaded ? '✅' : '❌'}`);
    console.log(`⏱️ Load Time: ${info.loadTime ? `${info.loadTime}ms` : 'N/A'}`);
    console.log(`📐 Dimensions: ${info.dimensions ? `${info.dimensions.width}x${info.dimensions.height}` : 'N/A'}`);
    console.log(`📱 Viewport: ${info.viewport.width}x${info.viewport.height}`);
    console.log(`🌐 User Agent: ${info.userAgent}`);
    if (info.error) {
      console.error(`❌ Error: ${info.error}`);
    }
    console.groupEnd();
  }

  getAllDebugInfo(): ImageDebugInfo[] {
    return Array.from(this.debugInfo.values());
  }

  // Test background image CSS support on iOS
  testBackgroundImageSupport(): boolean {
    const testDiv = document.createElement('div');
    testDiv.style.backgroundImage = 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)';
    testDiv.style.backgroundSize = 'cover';
    testDiv.style.width = '1px';
    testDiv.style.height = '1px';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-9999px';
    
    document.body.appendChild(testDiv);
    
    const computedStyle = window.getComputedStyle(testDiv);
    const hasBackgroundImage = computedStyle.backgroundImage !== 'none';
    
    document.body.removeChild(testDiv);
    
    console.log(`🖼️ Background image support: ${hasBackgroundImage ? '✅' : '❌'}`);
    return hasBackgroundImage;
  }

  // Create a comprehensive iOS image test
  async runIOSImageTest(imageUrl: string): Promise<void> {
    console.group('🍎 iOS Image Compatibility Test');
    
    // Basic device detection
    console.log(`📱 Device Detection:`);
    console.log(`  iOS Device: ${this.isIOSDevice() ? '✅' : '❌'}`);
    console.log(`  User Agent: ${navigator.userAgent}`);
    console.log(`  Platform: ${navigator.platform}`);
    console.log(`  Touch Points: ${navigator.maxTouchPoints}`);
    
    // Viewport info
    console.log(`📐 Viewport Info:`);
    console.log(`  Window: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`  Screen: ${screen.width}x${screen.height}`);
    console.log(`  Device Pixel Ratio: ${window.devicePixelRatio}`);
    
    // Background image support
    console.log(`🖼️ CSS Support:`);
    this.testBackgroundImageSupport();
    
    // Test image loading
    console.log(`📥 Image Loading Test:`);
    try {
      const debugInfo = await this.testImageLoad(imageUrl);
      this.logDebugInfo(imageUrl);
    } catch (error) {
      console.error(`❌ Image test failed:`, error);
    }
    
    console.groupEnd();
  }
}

// Export singleton instance
export const iosImageDebugger = IOSImageDebugger.getInstance();

// Auto-run test in development mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Add debug button to page
      const debugButton = document.createElement('button');
      debugButton.textContent = '🍎 Test iOS Images';
      debugButton.style.position = 'fixed';
      debugButton.style.top = '10px';
      debugButton.style.right = '10px';
      debugButton.style.zIndex = '9999';
      debugButton.style.padding = '8px 12px';
      debugButton.style.backgroundColor = '#007AFF';
      debugButton.style.color = 'white';
      debugButton.style.border = 'none';
      debugButton.style.borderRadius = '6px';
      debugButton.style.fontSize = '12px';
      debugButton.style.cursor = 'pointer';
      
      debugButton.onclick = () => {
        // Get current hero background image
        const heroElement = document.querySelector('.hero-bg-mobile') as HTMLElement;
        if (heroElement) {
          const bgImage = heroElement.style.backgroundImage;
          const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            iosImageDebugger.runIOSImageTest(urlMatch[1]);
          }
        }
      };
      
      document.body.appendChild(debugButton);
    });
  }
}
