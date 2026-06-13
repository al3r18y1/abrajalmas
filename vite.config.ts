import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        entry: "server",
        preset: process.env.NITRO_PRESET ?? "netlify",
      },
    }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
});
