import Head from "next/head";
import { Box, Typography, Container } from "@mui/material";
import Layout from "@/components/common/layoutComponent";
import { AboutSection, FeatureItem } from "@/components/common/aboutComponents";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - CyberArena</title>
        <meta
          name="description"
          content="Learn about CyberArena - A platform for indie game developers"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <Container
          maxWidth="md"
          sx={{
            py: { xs: 6, md: 10 },
            minHeight: "60vh",
          }}
        >
          <Typography
            variant="h2"
            className="gaming-title"
            fontFamily="'Jersey 10', sans-serif"
            textTransform="uppercase"
            letterSpacing="3px"
            mb={4}
            fontSize={{ xs: "2rem", md: "3rem" }}
          >
            About CyberArena
          </Typography>

          <Box display="flex" flexDirection="column" gap={4}>
            <AboutSection title="Our Mission">
              <Typography variant="body1" lineHeight={1.8}>
                CyberArena helps independent game developers gain visibility
                and connect with their audience—because great games deserve
                to be discovered.
              </Typography>
            </AboutSection>

            <AboutSection title="What We Do">
              <Typography variant="body1" lineHeight={1.8}>
                We provide a curated platform for showcasing indie games,
                gathering community feedback, and building a loyal player base.
              </Typography>
            </AboutSection>

            <AboutSection title="Platform Features">
              <Box display="flex" flexDirection="column" gap={3}>
                <FeatureItem
                  title="Curated Library"
                  description="Every game is reviewed for quality and originality."
                />
                <FeatureItem
                  title="Community Reviews"
                  description="Authentic feedback from real players."
                />
                <FeatureItem
                  title="Developer Support"
                  description="Tools, analytics, and community engagement."
                />
                <FeatureItem
                  title="Easy Discovery"
                  description="Advanced filters to find games instantly."
                />
              </Box>
            </AboutSection>

            <AboutSection title="Why Choose CyberArena?">
              <Box component="ul" pl={3}>
                {[
                  "Free to use for everyone",
                  "Quality-focused curation",
                  "Community-driven recommendations",
                  "Developer-friendly ecosystem",
                  "Constantly expanding library",
                ].map((item) => (
                  <Typography component="li" key={item} lineHeight={1.7}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </AboutSection>
          </Box>
        </Container>
      </Layout>
    </>
  );
}
