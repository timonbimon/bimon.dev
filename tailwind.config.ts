import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "70ch",
            color: "inherit",
            a: {
              color: "#2563eb", // text-blue-600
              "&:hover": {
                color: "#1d4ed8", // text-blue-800
              },
            },
            "h1, h2, h3, h4": {
              color: "inherit",
              fontWeight: "700",
            },
            code: {
              color: "inherit",
            },
            "pre code": {
              backgroundColor: "transparent",
              borderRadius: 0,
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
