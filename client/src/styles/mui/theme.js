const { createTheme, responsiveFontSizes } = require("@mui/material/styles");

// Colour Variables from globals.css
const neonBlue = "#38bdf8";
const neonPurple = "#a855f7";

// Light Theme Colour Variables
const backgroundColourLight = "#f8fafc";
const backgroundSecondaryLight = "#ffffff";
const textPrimaryLight = "#020617";
const textSecondaryLight = "#475569";
const cardBgLight = "rgba(255, 255, 255, 0.85)";

// Dark Theme Colour Variables
const backgroundColourDark = "#020617";
const backgroundSecondaryDark = "rgba(8, 16, 51, 0.85)";
const textPrimaryDark = "#e5e7eb";
const textSecondaryDark = "#94a3b8";
const cardBgDark = "rgba(34, 48, 80, 0.85)";

// Light Theme
let lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: backgroundColourLight,
      paper: cardBgLight,
      secondary: backgroundSecondaryLight,
    },
    primary: {
      main: neonPurple,
    },
    secondary: {
      main: neonBlue,
    },
    text: {
      primary: textPrimaryLight,
      secondary: textSecondaryLight,
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 18px",
          textTransform: "none",
          transition: "all 0.25s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

// Dark Theme
let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: backgroundColourDark,
      paper: cardBgDark,
      secondary: backgroundSecondaryDark,
    },
    primary: {
      main: neonPurple,
    },
    secondary: {
      main: neonBlue,
    },
    text: {
      primary: textPrimaryDark,
      secondary: textSecondaryDark,
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 18px",
          textTransform: "none",
          transition: "all 0.25s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

export { lightTheme, darkTheme };

