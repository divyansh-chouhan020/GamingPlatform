import Head from "next/head";
import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Layout from "@/components/common/layoutComponent";

export default function Blog() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Blog - CyberArena</title>
        <meta name="description" content="Read the latest news and updates from CyberArena" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Container maxWidth="md" sx={{ padding: { xs: "24px", md: "48px" }, minHeight: "60vh" }}>
          <Box
            sx={{
              textAlign: "center",
              padding: { xs: "48px 24px", md: "80px 48px" },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                marginBottom: "24px",
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Blog
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Welcome to the CyberArena blog. Stay tuned for updates!
            </Typography>
          </Box>
        </Container>
      </Layout>
    </>
  );
}

