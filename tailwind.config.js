module.exports = {
  theme: {
    extend: {
      borderRadius: {
        'inherit': 'inherit',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-slow-reverse': 'spin-reverse 4s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
  },
};