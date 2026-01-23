import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Прокси убран, используем прямые запросы на полный URL
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

}));

