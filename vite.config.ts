import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
          query: ['@tanstack/react-query'],
          swiper: ['swiper'],
        },
      },
    },
    // Оптимизации
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: mode === 'development',
    // Увеличиваем chunk size warning
    chunkSizeWarningLimit: 1000,
  },
  // Оптимизации зависимостей
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react'
    ],
  },
}));