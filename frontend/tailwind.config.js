/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { 
        fgDashLight: '#2A2438',
        bgDashLight: '#483DD5',
        dashBtnBg: '#6366F1',

		    fgDashDark: '#fff',
        bgDashDark: '#2A2438',
        mainDarkBgcolor: '#5C5470',
        uiBgcolor: '#352F44',
        darkBtn: '#DBD8E3',
		    normalBtn: '#3B82F6',
        warningBtn: '#E8BCB9',
		    warningBtnHover: '#A03C47',
		 	
	},
    },
  },
  plugins: [],
}