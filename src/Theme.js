import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
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
  },
});
