import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: '/lit-sheet-music/',
  build: {
    lib: {
      entry: "src/lit-sheet-music.ts",
      formats: ["es"],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});