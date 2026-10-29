import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@barpro/core': '/workspaces/barpro/core/src',
        },
    },
    server: {
        port: 5174,
    },
});
