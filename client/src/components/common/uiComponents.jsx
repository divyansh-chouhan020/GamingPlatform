import { CyberButtonPrimary, CyberButtonSecondary, CyberCard, CyberTextField } from "@/styles/mui/customComponents";
import { Button as MuiButton, Card as MuiCard, CircularProgress, Box, Backdrop, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const VARIANTS = { primary: CyberButtonPrimary, secondary: CyberButtonSecondary };
const TOAST_COLORS = { success: "#22c55e", error: "#ef4444" };

export function Button({ label, onClick, type = "button", variant = "primary", icon: Icon, iconPosition = "left", iconOnly = false, disabled = false, sx, ...props }) {
  const Comp = VARIANTS[variant] || MuiButton;
  const iconProps = Icon ? { [iconPosition === "left" ? "startIcon" : "endIcon"]: <Icon /> } : {};
  const styles = { ...(iconOnly && { minWidth: "auto", padding: "10px" }), ...(variant === "danger" && { background: "transparent", border: "1px solid #ef4444", color: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.6)", "&:hover": { background: "transparent", boxShadow: "0 0 14px rgba(239,68,68,0.8)" } }), ...sx };
  
  return <Comp type={type} disabled={disabled} onClick={onClick} {...iconProps} sx={styles} {...props}>{!iconOnly && label}</Comp>;
}

export function Card({ children, hoverable = true }) {
  return hoverable ? <CyberCard sx={{ padding: "16px" }}>{children}</CyberCard> : <MuiCard sx={{ padding: "16px" }}>{children}</MuiCard>;
}

export function InputField({ label, type = "text", value, onChange, placeholder, error, helperText, name, multiline, rows, ...props }) {
  return <CyberTextField name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} label={label} error={!!error} helperText={error || helperText} fullWidth variant="outlined" multiline={multiline} rows={rows} {...props} />;
}

export function Loader({ fullscreen = false }) {
  const theme = useTheme();
  const color = theme.palette.secondary.main;
  
  return fullscreen ? (
    <Backdrop open={true} sx={{ zIndex: 100, backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.background.paper }}>
      <CircularProgress sx={{ color }} />
    </Backdrop>
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" padding="20px">
      <CircularProgress sx={{ color }} />
    </Box>
  );
}

export function Toast({ message, type = "success", onClose, open = true }) {
  const theme = useTheme();
  const color = TOAST_COLORS[type] || TOAST_COLORS.success;
  
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} sx={{ zIndex: 200 }}>
      <Alert onClose={onClose} severity={type === "error" ? "error" : "success"} sx={{ backgroundColor: theme.palette.background.secondary || theme.palette.background.paper, color: theme.palette.text.primary, border: `1px solid ${color}`, boxShadow: `0 0 16px ${color}66`, "& .MuiAlert-icon": { color } }}>
        {message}
      </Alert>
    </Snackbar>
  );
}