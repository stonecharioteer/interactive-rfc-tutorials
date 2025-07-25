import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["localhost"],
    watch: {
      usePolling: true,
    },
  },
});
