/**
 * PWA & Offline Service Worker Registration Helper
 */

export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          // Registration successful
        })
        .catch(err => {
          // Registration failed
        });
    });
  }
}
