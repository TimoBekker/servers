import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/laravel-api": {
        target: "http://192.168.126.143:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/laravel-api/, "/api"),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Laravel API proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxying to Laravel API:", req.url);
          });
        },
      },
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
