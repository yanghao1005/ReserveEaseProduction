import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7AB2B2",
    },
    secondary: {
      main: "#4D869C",
    },
    background: {
      default: "#CDE8E5",
    },
    text: {
      primary: "#4D869C",
      secondary: "#EEF7FF",
    },
  },
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.MuiPickersDay-today": {
            borderColor: "#000000",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#4D869C", // Color del label
          "&.Mui-focused": {
            color: "#7AB2B2", // Color del label quan està enfocat
          },
        },
      },
    },
  },
});

export default theme;
