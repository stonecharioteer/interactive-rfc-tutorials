import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/interactive-tutorials/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["ab594e000ae7.ngrok-free.app", "localhost"],
    watch: {
      usePolling: true,
    },
  },
});
