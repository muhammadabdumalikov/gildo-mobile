/**
 * React Native Reanimated configuration
 * Suppresses harmless warnings from framework animations (Expo Router modals)
 * 
 * These warnings come from Expo Router's internal navigation animations
 * and are not actionable by our code. They're framework-level optimizations.
 */
if (__DEV__ && typeof console !== 'undefined') {
  const originalWarn = console.warn.bind(console);
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Filter out Reanimated inline style warnings that come from framework code
    if (
      typeof message === 'string' &&
      message.includes('shared value') &&
      message.includes('.value inside reanimated inline style')
    ) {
      return; // Suppress this specific warning
    }
    // Pass through all other warnings
    originalWarn(...args);
  };
}

export { };

