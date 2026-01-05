import { useState } from "react";
import { Card, InputField, Button, Toast, Loader } from "@/components/common/uiComponents";
import { gameAPI } from "@/services/api";
import { Typography, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const GENRES = ["action", "adventure", "puzzle", "rpg", "sports", "strategy", "other"];

export function UploadGameForm({ onSubmit, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    genre: "other",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.desc || !formData.genre) {
      setError("All fields are required");
      setShowToast(true);
      return;
    }

    if (formData.desc.length < 8) {
      setError("Description must be at least 8 characters");
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await gameAPI.createGame({
        title: formData.title,
        desc: formData.desc,
        genre: formData.genre,
      });

      if (onSuccess) {
        onSuccess(response);
      }
      
      setFormData({
        title: "",
        desc: "",
        genre: "other",
      });

      if (onSubmit) {
        onSubmit(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to create game");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader fullscreen />}
      <Card>
        <Typography variant="h5" sx={{ marginBottom: "16px" }}>
          Upload Game
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InputField
            label="Game Title"
            value={formData.title}
            onChange={(e) =>
              handleChange("title", e.target.value)
            }
            error={error && !formData.title ? error : null}
          />

          <InputField
            label="Description"
            value={formData.desc}
            onChange={(e) =>
              handleChange("desc", e.target.value)
            }
            error={error && formData.desc && formData.desc.length < 8 ? "Description must be at least 8 characters" : null}
            helperText="Minimum 8 characters, maximum 500 characters"
            multiline
            rows={4}
          />

          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={formData.genre}
              label="Genre"
              onChange={(e) => handleChange("genre", e.target.value)}
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            label={loading ? "Submitting..." : "Submit Game"} 
            onClick={handleSubmit}
            disabled={loading}
            type="submit"
          />
        </Box>

        {showToast && error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setShowToast(false)}
          />
        )}
      </Card>
    </>
  );
}

