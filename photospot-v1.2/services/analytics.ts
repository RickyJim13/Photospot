/**
 * Tracks a custom event with Google Analytics.
 * @param eventName The name of the event to track.
 * @param eventParams Optional parameters to send with the event.
 */
export const trackEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn(`Google Analytics not initialized. Event "${eventName}" not tracked.`);
  }
};
