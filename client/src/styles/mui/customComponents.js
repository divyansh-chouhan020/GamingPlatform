import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom Card with cyber theme styling
export const CyberCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.mode === "dark" 
    ? "rgba(56, 189, 248, 0.25)" 
    : "rgba(56, 189, 248, 0.4)"}`,
  boxShadow: theme.palette.mode === "dark"
    ? "0 0 14px rgba(56, 189, 248, 0.15)"
    : "0 0 8px rgba(56, 189, 248, 0.1)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 0 22px rgba(56, 189, 248, 0.35)"
      : "0 0 16px rgba(56, 189, 248, 0.25)",
  },
}));

// Primary Button with gradient
export const CyberButtonPrimary = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #a855f7, #38bdf8)",
  color: "#ffffff",
  boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
  "&:hover": {
    background: "linear-gradient(135deg, #a855f7, #38bdf8)",
    boxShadow: "0 0 18px rgba(56, 189, 248, 0.9)",
  },
}));

// Secondary Button with border
export const CyberButtonSecondary = styled(Button)(({ theme }) => ({
  background: "transparent",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.secondary.main}`,
  boxShadow: "0 0 8px rgba(56, 189, 248, 0.4)",
  "&:hover": {
    background: "transparent",
    boxShadow: "0 0 14px rgba(56, 189, 248, 0.7)",
  },
}));

// Custom TextField with cyber theme
export const CyberTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: theme.palette.mode === "dark"
      ? theme.palette.background.secondary
      : theme.palette.background.paper,
    color: theme.palette.text.primary,
    "& fieldset": {
      borderColor: "rgba(56, 189, 248, 0.4)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(56, 189, 248, 0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.secondary.main,
      boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
    },
    "& input": {
      color: theme.palette.text.primary,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    "&.Mui-focused": {
      color: theme.palette.secondary.main,
    },
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.text.secondary,
  },
}));

