module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        forest: "#23483b",
        leaf: "#3f7b59",
        gold: "#c59b52",
        mist: "#f5f6f1",
        clay: "#ba6d4d"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 27, 0.12)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
