import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 33100,
        open: true
    },
    optimizeDeps: {
        exclude: ['monaco-editor']
    },
    build: {
        rollupOptions: {
            input: {
                web: resolve(__dirname, 'index.html'),
                desktop: resolve(__dirname, 'desktop.html')
            }
        }
    }
});
