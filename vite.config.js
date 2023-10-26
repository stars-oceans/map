import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "path",
        replacement: "path-browserify",
      },
    ],
    extensions: [".vue", ".js", ".ts", ".json"],
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    open: true,
  },
});
