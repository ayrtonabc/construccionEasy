import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // Add your static assets here
      manifest: {
        name: 'EasyProcess App',
        short_name: 'EasyProcess',
        description: 'Client and Admin Dashboard for EasyProcess',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // path starts from public folder
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // path starts from public folder
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // path starts from public folder
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Add maskable icon
          },
        ],
      },
      // Optional: Service worker configuration (generateSW is simpler for basic caching)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'], // Cache common assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      },
      devOptions: {
        enabled: true // Enable PWA features in development
      }
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
