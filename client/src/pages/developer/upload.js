import { UploadGameForm } from "@/components/common/developerComponents";
import { useRouter } from "next/router";
import { Typography, Box } from "@mui/material";

export default function UploadPage() {
  const router = useRouter();

  const handleSuccess = (response) => {
    // Redirect to dashboard after successful upload
    router.push("/developer/dashboard");
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h4" sx={{ marginBottom: "24px" }}>
        Upload New Game
      </Typography>
      <UploadGameForm onSuccess={handleSuccess} />
    </Box>
  );
}

