import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["ab594e000ae7.ngrok-free.app", "localhost"],
    watch: {
      usePolling: true,
    },
  },
});
