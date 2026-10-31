import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'BarPro — Gestion de bar',
                short_name: 'BarPro',
                description: 'Gestion de bar et buvette au Bénin — hors-ligne',
                theme_color: '#0B3322',
                background_color: '#F5F8F3',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
                ],
                shortcuts: [
                    {
                        name: 'Vendre',
                        short_name: 'Vente',
                        description: 'Ouvrir l\'écran de vente',
                        url: '/?tab=pos',
                        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
                    },
                    {
                        name: 'Stock',
                        short_name: 'Stock',
                        description: 'Consulter le stock',
                        url: '/?tab=stock',
                        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
                    },
                ],
                categories: ['business', 'finance'],
                launch_handler: { client_mode: 'focus-existing' },
                prefer_related_applications: false,
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,txt}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            cacheableResponse: { statuses: [0, 200] },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            cacheableResponse: { statuses: [0, 200] },
                        },
                    },
                    {
                        urlPattern: function (_a) {
                            var request = _a.request;
                            return request.destination === 'image';
                        },
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
                            cacheableResponse: { statuses: [0, 200] },
                        },
                    },
                ],
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
            },
            devOptions: {
                enabled: true,
                type: 'module',
            },
        }),
    ],
    resolve: {
        alias: {
            '@barpro/core': '/workspaces/barpro/core/src',
        },
    },
    server: {
        port: 5173,
    },
});
