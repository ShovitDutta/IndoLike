module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { gruvbox: { "bg-hard": "#1d2021", fg: "#ebdbb2", gray: "#a89984", purple: "#d3869b", orange: "#fe8019", cyan: "#8ec07c" } },
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
    },
  },
  plugins: [],
};
