import { Card, Button } from "@/components/common/uiComponents";
import { Box, Typography, Rating, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function GameCard({
  title,
  genre,
  thumbnail,
  onPlay,
  averageRating = 0,
  totalReviews = 0,
}) {
  const theme = useTheme();

  return (
    <Card>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Box
          sx={{
            height: "160px",
            borderRadius: "10px",
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: `1px solid ${theme.palette.mode === "dark" 
              ? "rgba(56,189,248,0.25)" 
              : "rgba(56,189,248,0.4)"}`,
          }}
        />

        <Box>
          <Typography variant="h6" sx={{ margin: 0, color: theme.palette.text.primary }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "13px",
              color: theme.palette.text.secondary,
              textTransform: "capitalize",
              marginTop: "4px",
            }}
          >
            {genre}
          </Typography>
          {averageRating > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
              <Rating
                value={averageRating}
                readOnly
                precision={0.1}
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.secondary.main,
                  },
                  "& .MuiRating-iconEmpty": {
                    color: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.3)" 
                      : "rgba(0, 0, 0, 0.26)",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                {averageRating.toFixed(1)} ({totalReviews})
              </Typography>
            </Box>
          )}
        </Box>

        <Button label="Play" onClick={onPlay} />
      </Box>
    </Card>
  );
}


