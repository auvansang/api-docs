import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    fontFamily: '"Nunito", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    button: {
      textTransform: 'none',
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: theme.spacing(4),
        },
      },
    },
  },
};

theme = responsiveFontSizes(theme);

export default theme;
