import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif`,
  },
  overrides: {
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiContainer: {
      root: {
        padding: "30px 0 30px 0",
      },
    },
    MuiTab: {
      root: {
        "@media (min-width: 600px)": {
          minWidth: "120px",
        },
      },
    },
  },
});
