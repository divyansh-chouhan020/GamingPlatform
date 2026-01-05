import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gameAPI } from "@/services/api";
import { AdminGameTable, AdminSidebar } from "@/components/common/adminComponents";
import { Loader, Toast, Button } from "@/components/common/uiComponents";
import { Box, Typography, Grid } from "@mui/material";

export default function AdminPage() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingGames();
  }, [page]);

  const fetchPendingGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameAPI.listPendingGames({
        page,
        limit: 10,
      });
      setGames(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch pending games");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (gameId) => {
    try {
      await gameAPI.approveGame(gameId);
      fetchPendingGames();
      setShowToast(true);
    } catch (err) {
      setError(err.message || "Failed to approve game");
      setShowToast(true);
    }
  };

  const handleReject = async (gameId) => {
    // Note: Backend doesn't have reject endpoint, we'll delete instead
    if (!confirm("Are you sure you want to reject (delete) this game?")) {
      return;
    }
    try {
      await gameAPI.deleteGame(gameId);
      fetchPendingGames();
      setShowToast(true);
    } catch (err) {
      setError(err.message || "Failed to reject game");
      setShowToast(true);
    }
  };

  if (loading && games.length === 0) {
    return <Loader fullscreen />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, padding: "24px" }}>
        <Typography variant="h4" sx={{ marginBottom: "24px" }}>
          Pending Game Approvals
        </Typography>

        {games.length === 0 ? (
          <Box sx={{ textAlign: "center", padding: "48px" }}>
            <Typography>No pending games to approve</Typography>
          </Box>
        ) : (
          <>
            <AdminGameTable
              games={games}
              onApprove={handleApprove}
              onReject={handleReject}
            />
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
          </>
        )}

        {showToast && error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setShowToast(false)}
          />
        )}
      </Box>
    </Box>
  );
}

