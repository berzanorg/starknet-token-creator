/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte}'],
	theme: {
		extend: {
			height: {
				18: '4.5rem',
				140: '35rem',
				160: '40rem',
				180: '45rem',
				200: '50rem'
			},
			spacing: {
				18: '4.5rem'
			}
		}
	},
	future: {
		hoverOnlyWhenSupported: true
	},
	plugins: []
}
