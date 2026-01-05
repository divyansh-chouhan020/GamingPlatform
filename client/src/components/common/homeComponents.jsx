import { Box, Typography, Card, CardMedia, CardContent, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Link from "next/link";
import { CyberCard } from "@/styles/mui/customComponents";

const FEATURES = [
  { name: "CURATED LIBRARY", description: "Play to discover.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h12M6 14h8"/></svg> },
  { name: "COMMUNITY REVIEWS", description: "Build for indie Developers.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { name: "PUBLISH YOUR GAME", description: "Your game deserves players.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/></svg> },
];

export function Hero() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box component="section" sx={{ position: "relative", width: "100vw", height: "100vh", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url(/bg/heroBg.gif)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed", "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: isDark ? "linear-gradient(135deg, rgba(2, 6, 23, 0.3) 0%, rgba(34, 48, 80, 0.25) 100%)" : "linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(255, 255, 255, 0.25) 100%)", zIndex: 0 }, borderBottom: `1px solid ${isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(56, 189, 248, 0.1)"}`, padding: { xs: "60px 24px", md: "100px 48px" }, marginBottom: "64px" }}>
      <Box sx={{ textAlign: "center", maxWidth: "900px", zIndex: 1, position: "relative" }}>
        <Typography variant="h1" className="hero-title" sx={{ fontFamily: "'Jersey 10', sans-serif", fontWeight: 400, fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" }, color: theme.palette.text.primary, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "3px", background: isDark ? "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)" : "linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: isDark ? "0 0 30px rgba(56, 189, 248, 0.3)" : "none" }}>
          DISCOVER & PLAY INDIE GAMES INSTANTLY
        </Typography>
        <Typography variant="h5" component="p" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "1rem", md: "1.25rem" }, fontWeight: 500, maxWidth: "700px", margin: "0 auto" }}>
          Join a growing community and explore something unique
        </Typography>
      </Box>
    </Box>
  );
}

export function GameCategory({ title, description, games = [], category }) {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";
  const categorySlug = category || title.toLowerCase().replace(/\s+/g, '-').replace(/-games$/, '').replace(/games$/, '').trim();

  return (
    <Box component="section" sx={{ width: "100%", marginBottom: "64px" }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: "0 24px", md: "0 48px" } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <Box>
            <Typography variant="h4" className="gaming-title" sx={{ fontFamily: "'Jersey 10', sans-serif", fontWeight: 400, color: theme.palette.text.primary, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "3px", fontSize: { xs: "1.5rem", md: "2rem" } }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: "0.95rem" }}>
              {description}
            </Typography>
          </Box>
          <Link href={`/games?category=${categorySlug}`} style={{ textDecoration: "none", color: theme.palette.secondary.main, fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
            View All Games →
          </Link>
        </Box>

        <Box sx={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px", scrollbarWidth: "thin", scrollbarColor: `${theme.palette.secondary.main}40 transparent`, "&::-webkit-scrollbar": { height: "8px" }, "&::-webkit-scrollbar-track": { background: "transparent" }, "&::-webkit-scrollbar-thumb": { background: isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(56, 189, 248, 0.2)", borderRadius: "4px", "&:hover": { background: isDark ? "rgba(56, 189, 248, 0.5)" : "rgba(56, 189, 248, 0.4)" } } }}>
          {games.map((game, i) => (
            <Card key={i} onClick={() => router.push("/")} sx={{ minWidth: "200px", maxWidth: "200px", cursor: "pointer", background: theme.palette.background.paper, border: `1px solid ${isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(56, 189, 248, 0.2)"}`, transition: "transform 0.25s ease, box-shadow 0.25s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: isDark ? "0 8px 24px rgba(56, 189, 248, 0.3)" : "0 8px 24px rgba(56, 189, 248, 0.2)" } }}>
              <CardMedia component="img" height="280" image={game.image || "/placeholder-game.png"} alt={game.name} sx={{ objectFit: "cover", background: isDark ? "rgba(34, 48, 80, 0.5)" : "rgba(248, 250, 252, 0.5)" }} />
              <CardContent sx={{ padding: "16px", background: theme.palette.background.paper }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary, marginBottom: "8px", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {game.name}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}>
                  Developed by: <span style={{ fontWeight: 500 }}>{game.developer}</span>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function PlatformFeatures() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box component="section" sx={{ width: "100%", padding: { xs: "48px 24px", md: "80px 48px" }, marginBottom: "64px" }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h3" className="gaming-title" sx={{ fontFamily: "'Jersey 10', sans-serif", fontWeight: 400, color: theme.palette.text.primary, marginBottom: "48px", textAlign: "center", textTransform: "uppercase", letterSpacing: "3px", fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
          PLATFORM FEATURES
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {FEATURES.map((feature, i) => (
            <Grid item xs={12} md={4} key={i}>
              <CyberCard sx={{ padding: "32px", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "translateY(-8px)" } }}>
                <Box sx={{ color: theme.palette.secondary.main, marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", filter: isDark ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))" : "none" }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" className="gaming-title" sx={{ fontFamily: "'Jersey 10', sans-serif", fontWeight: 400, color: theme.palette.text.primary, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "2px", fontSize: { xs: "1rem", md: "1.25rem" } }}>
                  {feature.name}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: "0.95rem" }}>
                  {feature.description}
                </Typography>
              </CyberCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}