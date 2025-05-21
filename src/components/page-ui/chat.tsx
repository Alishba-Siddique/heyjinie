// src/components/page-ui/chat.tsx
"use client";
import withAuth from '@/hoc/withAuth';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const ChatPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const tawkInitialized = useRef(false);
  const pathname = usePathname();

  // Function to initialize the Tawk widget
  const initializeTawk = () => {
    // Prevent multiple initializations
    if (tawkInitialized.current) return;
    
    // Clean up any existing instances first
    cleanupTawk();

    // Setup Tawk_API before loading the script
    (window as any).Tawk_API = {};
    (window as any).Tawk_LoadStart = new Date();
    
    const Tawk_API = (window as any).Tawk_API;
    
    // Configure Tawk API
    Tawk_API.onLoad = function() {
      // Start with the widget minimized but visible (default widget button will show)
      Tawk_API.minimize();
      // Disable sound notifications
      Tawk_API.disableSoundNotification();
      console.log('Tawk.to chat widget loaded and minimized');
      
      // Set a flag to ensure widget only opens on click, not automatically
      Tawk_API.customVisibility = 'minimized';
      
      // Override the default behavior to prevent automatic opening
      const originalOnChatMaximized = Tawk_API.onChatMaximized || function() {};
      Tawk_API.onChatMaximized = function() {
        // Only allow maximizing if user clicked the button
        if (Tawk_API.customVisibility === 'clicked') {
          originalOnChatMaximized();
        } else {
          // Force minimize if it tried to open automatically
          // setTimeout(() => Tawk_API.minimize(), 100);
        }
        // Reset flag after handling
        Tawk_API.customVisibility = 'minimized';
      };
      
      // Handle notifications
      Tawk_API.onChatMinimized = function() {
        Tawk_API.customVisibility = 'minimized';
      };
    };
    
    // Listen for clicks on the Tawk widget button
    document.addEventListener('click', function(event) {
      if (!Tawk_API) return;
      
      // Check if the click was on the Tawk button
      const target = event.target as Element;
      if (target && (
          target.closest('.tawk-min-container') || 
          target.closest('.tawk-button') ||
          target.closest('[class*="tawk"]')
      )) {
        // Set flag that user clicked the button
        Tawk_API.customVisibility = 'clicked';
      }
    }, true);

    // Create and insert the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://embed.tawk.to/67ab48833a842732607d0ffa/1ijqh6h51';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.id = 'tawk-script-bubble';
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load Tawk.to script');
      cleanupTawk();
    };
    
    // Add the script to the document
    document.body.appendChild(script);
    setScriptLoaded(true);
    tawkInitialized.current = true;

    // Add custom CSS to hide notifications
    const style = document.createElement('style');
    style.id = 'tawk-notification-override';
    style.innerHTML = `
      .tawk-notification, 
      .tawk-chat-notification,
      .tawk-sound-notification,
      .tawk-min-container .tawk-notification-container {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* Override any visibility transitions */
      .tawk-notification-container * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Helper function to clean up Tawk instance
  const cleanupTawk = () => {
    // Remove the script tag if it exists
    const existingScript = document.getElementById('tawk-script-bubble');
    if (existingScript) {
      existingScript.remove();
    }

    // Remove custom styles
    const customStyle = document.getElementById('tawk-notification-override');
    if (customStyle) customStyle.remove();
    
    // Reset Tawk API if it exists
    if ((window as any).Tawk_API) {
      try {
        // Attempt to remove Tawk iframe elements
        const tawkIframes = document.querySelectorAll('iframe[title*="chat"]');
        tawkIframes.forEach(iframe => iframe.remove());
      } catch (e) {
        console.log('Error cleaning up Tawk widget:', e);
      }
    }
    
    // Reset Tawk API variables
    (window as any).Tawk_API = undefined;
    (window as any).Tawk_LoadStart = undefined;

    // Reset the loaded state
    setScriptLoaded(false);
    tawkInitialized.current = false;
  };

  // Effect to handle authentication loading state
  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated) {
      console.log('Auth confirmed, initializing chat widget');
      initializeTawk();
    } else {
      cleanupTawk();
    }

    return () => {
      cleanupTawk();
    };
  }, [isAuthenticated, isLoading]);

  // Effect to handle pathname changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && !scriptLoaded) {
      initializeTawk();
    }
  }, [pathname, isAuthenticated, isLoading]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupTawk();
    };
  }, []);

  // Don't render anything visible, just the container for Tawk
  if (!isAuthenticated) return null;

  return <div id="tawk-root" />;
};

export default withAuth(ChatPage);