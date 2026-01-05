import { Box, Container } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Container maxWidth="lg" sx={{ backgroundColor: "transparent" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: "48px",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: "16px",
            padding: { xs: "24px", md: "48px" },
            boxShadow: (theme) =>
              `0 4px 20px ${
                theme.palette.mode === "dark"
                  ? "rgba(56, 189, 248, 0.2)"
                  : "rgba(0, 0, 0, 0.1)"
              }`,
          }}
        >
          {/* Left image column */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="/cyberArena_img.png"
              alt="CyberArena"
              sx={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Right content */}
          {children}
        </Box>
      </Container>
    </Box>
  );
}
