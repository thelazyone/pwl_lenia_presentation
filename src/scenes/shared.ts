export const Colors = {
  whiteLabel: 'rgba(255, 255, 255, 0.54)',
  blackLabel: 'rgba(0, 0, 0, 0.87)',
  background: '#141414',
  surface: '#242424',
  surfaceLight: '#c0b3a3',

  KEYWORD: '#ff6470',
  TEXT: '#ACB3BF',
  FUNCTION: '#ffc66d',
  STRING: '#99C47A',
  NUMBER: '#68ABDF',
  PROPERTY: '#AC7BB5',
  COMMENT: '#808586',

  red: '#ef5350',
  green: '#8bc34a',
  blue: '#2196f3',
};

export const BaseFont = {
  fontFamily: 'JetBrains Mono',
  fontWeight: 700,
  fontSize: 28,
  lineHeight: 64,
};

export const WhiteLabel = {
  ...BaseFont,
  fill: Colors.whiteLabel,
};

export const BlackLabel = {
  ...BaseFont,
  fill: Colors.blackLabel,
};

export const textStyles = {
  h1: {
    ...BaseFont,
    fontSize: 80,
    fill: Colors.whiteLabel,
    shadowColor: '#000000',
    shadowBlur: 10,
  },
  h2: {
    ...BaseFont,
    fontSize: 50,
    fontWeight: 500,
    fill: Colors.FUNCTION,
    shadowColor: '#000000',
    shadowBlur: 5,
  },
  body: {
    ...BaseFont,
    fontSize: 36,
    fontWeight: 400,
    fill: Colors.TEXT,
    shadowColor: '#000000',
    shadowBlur: 5,
  },
}; 