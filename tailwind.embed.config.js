/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/(embedded)/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/NewPlayer/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      saffron: "#EEC643",
      night: "#141414",
      antiflash: "#EEF0F2",
      "antiflash-light": "#f7f8f9",
      zaffre: "#0D21A1",
      oxfordblue: "#011638",
      "delete-red": "#ee4444",
      "play-green": "#65ee44",
      white: "#FFFFFF",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};