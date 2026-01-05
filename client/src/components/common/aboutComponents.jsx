import { Box, Typography } from "@mui/material";


export function AboutSection({ title, children }) {
  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={600}
        mb={2}
        fontSize={{ xs: "1.25rem", md: "1.5rem" }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function FeatureItem({ title, description }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" lineHeight={1.7}>
        {description}
      </Typography>
    </Box>
  );
}
