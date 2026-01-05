// Design system colors and theme for Yolkk app
export const Colors = {
  primary: '#FFA726',
  background: '#FFF4E0', // Light cream
  tabBarBackground: '#FFE0B2', // Light orange/peach for tab bar
  cardBackground: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',
  pillYellow: '#FFC107',
  pillBlue: '#42A5F5',
  pillGreen: '#66BB6A',
  pillRed: '#EF5350',
  pillPurple: '#AB47BC',
  pillOrange: '#FF7043',
  inputBorder:'#323232',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Typography = {
  header: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
  },
  subheader: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
  body: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
  },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const Shadow = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

