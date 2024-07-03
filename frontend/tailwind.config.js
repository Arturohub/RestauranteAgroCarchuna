/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        acme: ['Acme', 'sans-serif'],
        alfaSlabOne: ['Alfa Slab One', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        frankRuhlLibre: ['Frank Ruhl Libre', 'serif'],
        lilitaOne: ['Lilita One', 'cursive'],
        lobster: ['Lobster', 'cursive'],
        londrinaSketch: ['Londrina Sketch', 'cursive'],
        pacifico: ['Pacifico', 'cursive'],
        permanentMarker: ['Permanent Marker', 'cursive'],
        purplePurse: ['Purple Purse', 'cursive'],
        suravaram: ['Suravaram', 'serif'],
        ubuntuSansMono: ['Ubuntu Sans Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
