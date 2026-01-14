/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",

        white: "#fff",
        whiteLow: "#F6F6F6",

        "black-25": "rgba(0, 0, 0, 0.25)",
        "black-04": "rgba(0, 0, 0, 0.04)",
        black: "#000",
        blackHigh: "#303C58",
        blackSemi: "#45526E",
        blackLow: "#707D9B",

        blueColor: "#515EDB",
        blueLight: "#F0F1FF",

        themeMid: "#EFF7FF",
        themeSemi: "#F9F9F9",
        slateLow: "#E0E0E0",

        primaryColor: "var(--primary-color)",
        themeMid: "#F5F5F5",
        // secondaryColor: "var(--secondary-color)",
        // primaryColor: "#EF5777",
        secondaryColor: "#FFEBF0",

        coralLight: "#FF8155",

        orangeLight: "#FFE3D9",
        orangeColor: "#FF8155",

        infoColor: "#4FAAFD",
        infoHigh: "#3790FA",
        infoLight: "#E1EFFF",

        warningColor: "#F2C963",

        successColor: "#7FC767",
        successHigh: "#2CC672",
        successMid: "#12AA58",
        successLow: "#EDFFF5",
        successLight: "#D9FFCC",

        errorColor: "#FF6B6B",
        errorHigh: "#F93A6E",

        fadeColor: "#B8B8B8",
        fadeLight: "#F6F6F6",

        pinkLight: "#FFDEE2",
        violetLight: "#E6E4FB",
        blueLight: "#CEE2FA",
        yellowLight: "#FDF1D5",
        pinkColor: "#FF5C70",
        violetColor: "#A490E9",
        blueColor: "#1D426E",
        yellowColor: "#FFBD1B",

        "border-color": "#ECECEC",

        "main-50": "#E6FFF8",
        "main-100": "#C0FFE9",
        "main-200": "#8AFFD7",
        "main-300": "#4DFFC2",
        "main-400": "#1AF0AD",
        "main-500": "#00C896",
        "main-600": "#00A37B",
        "main-700": "#008462",
        "main-800": "#00664C",
        "main-900": "#004F3B",
        "main-950": "#00291F",

        "natural-50": "#FAFAFA",
        "natural-100": "#F5F5F5",
        "natural-200": "#EEEEEE",
        "natural-300": "#E0E0E0",
        "natural-400": "#BDBDBD",
        "natural-500": "#9E9E9E",
        "natural-600": "#757575",
        "natural-700": "#424242",
        "natural-800": "#424242",
        "natural-900": "#212121",

        "black-600": "#888888",
        "black-700": "#4F4F4F",
        "black-800": "#131313",
        "black-900": "#191919",
        "white-50": "#FFFFFF",
        "white-100": "#E7E7E7",
        "white-200": "#D1D1D1",
        disabled: "#D0D0D0",

        "status-error": "#FF6B6B",
        "status-alert": "#FECA57",
      },

      backgroundImage: {
        authBg: "url('./assets/images/bg.png')",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("preline/plugin"), require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
