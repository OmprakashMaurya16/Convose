import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  themes: [
    {
      converseTheme: {
        primary: "#4f46e5", // Indigo-600
        secondary: "#9333ea", // Purple-600
        accent: "#10b981", // Emerald-500
        neutral: "#1f2937", // Gray-800
        "base-100": "#f9fafb", // Gray-50
        info: "#0ea5e9", // Sky-500
        success: "#22c55e", // Green-500
        warning: "#f59e0b", // Amber-500
        error: "#ef4444", // Red-500
      },
    },
  ],
});
