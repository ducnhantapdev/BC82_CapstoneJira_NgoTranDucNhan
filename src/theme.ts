import { createTheme } from "@mui/material/styles";

// Create a theme instance.

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
  },
});
export default theme;
