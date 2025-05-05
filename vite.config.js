import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss({
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    }),
    react(),
  ],
  build: {
    outDir: 'dist', 
  },
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true
    }
  },
  proxy: {
    '/api': {
      target: 'http://backend:3000',
      changeOrigin: true,
      secure: false,
    }}
});
