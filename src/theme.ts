import { createTheme } from "@mui/material/styles";

export const APP_BAR_HEIGHT = "80px";
export const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`;

declare module "@mui/material/styles" {
  interface Theme {
    jiraCustom: {
      appBarHeight: string;
      boardContentHeight: string;
    };
  }
  interface ThemeOptions {
    jiraCustom?: {
      appBarHeight?: string;
      boardContentHeight?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00B2BF",
    },
    secondary: {
      main: "#edf2ff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": { fontSize: "0.875rem" },
        },
      },
    },
  },
  jiraCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
  },
});

export default theme;
