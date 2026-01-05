import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, IconButton, Box, TextField, FormControl, InputLabel, Select, MenuItem, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Cookies from "js-cookie";

import { lightTheme, darkTheme } from "@/styles/mui/theme";
import { setTheme, toggleTheme } from "@/redux/slices/themeSlice";
import { logout } from "@/redux/slices/authSlice";
import { authAPI } from "@/services/api";
import { Button } from "@/components/common/uiComponents";
import { GENRES } from "@/constants/genres";

const NAV_LINKS = [
  { label: "Home", action: (r) => r.push("/") },
  { label: "Discover", action: (r) => r.pathname === "/" ? document.getElementById("featured-games")?.scrollIntoView({ behavior: "smooth" }) : r.push("/#featured-games") },
  { label: "About", action: (r) => r.push("/about") },
];

const ROLE_BUTTONS = {
  user: [["Games", "secondary", "/"], ["Profile", "primary", "/user/profile"]],
  developer: [["Dashboard", "secondary", "/developer/dashboard"], ["Upload Game", "primary", "/developer/upload"]],
  admin: [["Admin Panel", "primary", "/admin"]],
};

const FOOTER_LINKS = ["About", "Privacy", "Terms", "Contact"];
const SOCIAL_ICONS = { Facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", Twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", Instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", YouTube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" };

function NavBar({ filters, onFilterChange }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.theme.mode);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const muiTheme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try { await authAPI.logout(); } finally { dispatch(logout()); router.push("/"); }
  };

  const isDark = muiTheme.palette.mode === "dark";
  const baseStyle = { color: muiTheme.palette.text.primary, fontSize: "14px", fontWeight: 500, textDecoration: "none", cursor: "pointer", "&:hover": { color: muiTheme.palette.secondary.main } };

  return (
    <AppBar position="static" sx={{ background: isDark ? "rgba(4, 10, 36, 0.85)" : "rgba(248, 250, 252, 0.95)", borderBottom: `1px solid ${isDark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.3)"}`, backdropFilter: "blur(10px)", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px", py: 1 }}>
        <Typography variant="h6" component="h2" onClick={() => router.push("/")} sx={{ color: muiTheme.palette.secondary.main, fontWeight: 600, cursor: "pointer", "&:hover": { textShadow: "0 0 10px rgba(56, 189, 248, 0.8)" } }}>
          CyberArena
        </Typography>

        <Box display="flex" gap="16px" alignItems="center" flexWrap="wrap">
          {NAV_LINKS.map(({ label, action }) => (
            <Typography key={label} component="a" onClick={(e) => { e.preventDefault(); action(router); }} sx={baseStyle}>{label}</Typography>
          ))}
          
          {filters && onFilterChange && (
            <>
              <TextField label="Search" value={filters.keyword || ""} onChange={(e) => onFilterChange("keyword", e.target.value)} size="small" sx={{ minWidth: "150px", maxWidth: "200px", "& .MuiOutlinedInput-root": { backgroundColor: muiTheme.palette.background.paper } }} />
              <FormControl size="small" sx={{ minWidth: "120px", maxWidth: "150px" }}>
                <InputLabel>Genre</InputLabel>
                <Select value={filters.genre || ""} label="Genre" onChange={(e) => onFilterChange("genre", e.target.value)} sx={{ backgroundColor: muiTheme.palette.background.paper }}>
                  <MenuItem value="">All</MenuItem>
                  {GENRES.map((g) => <MenuItem key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</MenuItem>)}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <Box display="flex" gap="12px" alignItems="center" flexWrap="wrap">
          {mounted && <IconButton onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme" sx={{ color: muiTheme.palette.text.primary, "&:hover": { transform: "scale(1.15)", filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))" } }}>{theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>}
          {!isAuthenticated ? (
            <>
              <Button label="Login" variant="secondary" onClick={() => router.push("/auth/login")} />
              <Button label="Sign Up" onClick={() => router.push("/auth/signUp")} />
            </>
          ) : (
            <>
              {ROLE_BUTTONS[role]?.map(([label, variant, href]) => <Button key={label} label={label} variant={variant} onClick={() => router.push(href)} />)}
              <Button label="Logout" variant="secondary" onClick={handleLogout} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  const router = useRouter();
  const theme = useTheme();
  const isFixed = ["/dashboard", "/games", "/player", "/developer", "/admin"].some((r) => router.pathname.startsWith(r));
  const isDark = theme.palette.mode === "dark";
  const linkSx = { fontSize: "14px", color: theme.palette.secondary.main, textDecoration: "none", transition: "opacity 0.2s", "&:hover": { opacity: 0.8 } };

  return (
    <Box component="footer" sx={{ position: isFixed ? "fixed" : "relative", bottom: isFixed ? 0 : "auto", width: "100%", padding: "20px 24px", background: isDark ? "rgba(4, 10, 36, 0.9)" : "rgba(248, 250, 252, 0.95)", borderTop: `1px solid ${isDark ? "rgba(56,189,248,0.25)" : "rgba(56,189,248,0.3)"}`, backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", zIndex: 50 }}>
      <Typography variant="body2" sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>© {new Date().getFullYear()} CyberArena</Typography>
      
      <Box display="flex" gap="8px" alignItems="center" flexWrap="wrap">
        {FOOTER_LINKS.map((link, i) => (
          <Box key={link} display="flex" alignItems="center" gap="8px">
            <Link href={`/${link.toLowerCase()}`} sx={linkSx}>{link}</Link>
            {i < FOOTER_LINKS.length - 1 && <Typography component="span" sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>|</Typography>}
          </Box>
        ))}
      </Box>

      <Box display="flex" gap="12px" alignItems="center">
        {Object.entries(SOCIAL_ICONS).map(([name, path]) => (
          <Link key={name} href="#" aria-label={name} sx={{ color: theme.palette.secondary.main, transition: "opacity 0.2s, transform 0.2s", "&:hover": { opacity: 0.8, transform: "scale(1.1)" } }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default function Layout({ children, filters, onFilterChange }) {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); dispatch(setTheme(Cookies.get("theme") || "dark")); }, [dispatch]);

  const theme = (mode || "dark") === "dark" ? darkTheme : lightTheme;

  if (!mounted) return <ThemeProvider theme={darkTheme}><CssBaseline /><Box sx={{ minHeight: "100vh", background: darkTheme.palette.background.default }} /></ThemeProvider>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar filters={filters} onFilterChange={onFilterChange} />
      <Box component="main" sx={{ width: "100%", minHeight: "100vh", background: theme.palette.background.default, color: theme.palette.text.primary }}>
        {children}
      </Box>
      <Footer />
    </ThemeProvider>
  );
}