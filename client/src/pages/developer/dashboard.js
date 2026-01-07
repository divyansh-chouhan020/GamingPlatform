import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { gameAPI } from "@/services/api";
import { Card, Button, Loader, Toast } from "@/components/common/uiComponents";
import { Box, Typography, Grid, Chip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeveloperDashboard() {
  const router = useRouter();
  const theme = useTheme();
  
  // --- AUTH CHECK ADDED ---
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- REDIRECT LOGIC ADDED ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user && user.suscription !== "premium") {
      // Redirect to home if they don't have the lifetime subscription
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.suscription === "premium") {
      fetchGames();
    }
  }, [page, user]);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameAPI.listDeveloperGames({
        page,
        limit: 10,
      });
      setGames(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch games");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId) => {
    if (!confirm("Are you sure you want to delete this game?")) {
      return;
    }

    try {
      await gameAPI.deleteGame(gameId);
      fetchGames();
      setShowToast(true);
    } catch (err) {
      setError(err.message || "Failed to delete game");
      setShowToast(true);
    }
  };

  // --- LOADER MODIFIED TO INCLUDE AUTH LOADING ---
  if ((loading || authLoading) && games.length === 0) {
    return <Loader fullscreen />;
  }

  // --- PREVENT RENDER IF NOT PREMIUM ---
  if (!user || user.suscription !== "premium") {
    return null;
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Typography variant="h4">My Games</Typography>
        <Button
          label="Upload New Game"
          onClick={() => router.push("/developer/upload")}
        />
      </Box>

      {games.length === 0 ? (
        <Card>
          <Typography>No games found. Upload your first game!</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid item xs={12} md={6} lg={4} key={game._id}>
              <Card>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <Typography variant="h6">{game.title}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/developer/edit/${game._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(game._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginBottom: "8px" }}>
                  {game.desc}
                </Typography>
                <Box sx={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <Chip
                    label={game.genre}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                    }}
                  />
                  <Chip
                    label={game.status}
                    size="small"
                    color={game.status === "approved" ? "success" : "warning"}
                    sx={{
                      textTransform: "capitalize",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Created: {new Date(game.createdAt).toLocaleDateString()}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          <Button
            label="Previous"
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <Typography sx={{ alignSelf: "center", padding: "0 16px" }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            label="Next"
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          />
        </Box>
      )}

      {showToast && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </Box>
  );
}