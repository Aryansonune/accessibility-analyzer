export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        a11yBlue: "#2F6BFF",
        cardBg: "#ffffff",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "Arial"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15,23,42,0.06)"
      }
    }
  },
  plugins: [],
}