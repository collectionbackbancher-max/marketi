/**
 * Safely load external scripts without breaking the app
 * Handles timeouts and errors gracefully
 */
export const loadExternalScript = (
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    timeout?: number;
    onlyInProduction?: boolean;
  } = {}
): Promise<void> => {
  return new Promise((resolve) => {
    // Skip in development if onlyInProduction is true
    if (options.onlyInProduction && import.meta.env.DEV) {
      resolve();
      return;
    }

    // Check if browser environment
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = options.async !== false;

    if (options.defer) {
      script.defer = true;
    }

    const timeout = options.timeout || 5000;
    let timeoutId: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timeoutId);
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      cleanup();
      resolve();
    };

    script.onerror = () => {
      cleanup();
      console.warn(`Failed to load external script: ${src}`);
      resolve();
    };

    timeoutId = setTimeout(() => {
      cleanup();
      console.warn(`Script load timeout: ${src}`);
      resolve();
    }, timeout);

    try {
      document.body.appendChild(script);
    } catch (error) {
      cleanup();
      console.warn(`Failed to append script: ${src}`, error);
      resolve();
    }
  });
};

/**
 * Load TikTok pixel safely (example)
 */
export const loadTikTokPixel = () => {
  return loadExternalScript('https://analytics.tiktok.com/i18n/pixel/events.js', {
    async: true,
    timeout: 3000,
    onlyInProduction: true,
  });
};

/**
 * Load Google Analytics safely (example)
 */
export const loadGoogleAnalytics = (measurementId: string) => {
  return loadExternalScript(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    {
      async: true,
      timeout: 5000,
      onlyInProduction: true,
    }
  );
};
