/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gray:{
        100:"#eeeeef",
        200:"#e6e9ed",
        600:"#95989c"
      },
      colors:{
        purple:{
          300:"#e1e4ff",
          500:"#3338a7",
          600:"#6e68b0",


        }
      }
    },
  },
  plugins: [],
}

