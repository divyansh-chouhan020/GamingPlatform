import { UploadGameForm } from "@/components/common/developerComponents";
import { useRouter } from "next/router";
import { Typography, Box, Alert } from "@mui/material"; // Added Alert
import { useSelector } from "react-redux"; // Added to check user status
import { useEffect } from "react";

export default function UploadPage() {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth); // Assuming auth slice exists

  useEffect(() => {
    // If not logged in and not loading, redirect to login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSuccess = (response) => {
    router.push("/developer/dashboard");
  };

  // If user is logged in but NOT premium, show a warning
  if (user && user.suscription !== "premium") {
    return (
      <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
        <Alert severity="warning">
          Only Premium members can upload games to the Arena. 
          Please upgrade your account on the home page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h4" sx={{ marginBottom: "24px", fontWeight: "bold" }}>
        Upload New Game
      </Typography>
      
      {/* The actual form component */}
      <UploadGameForm onSuccess={handleSuccess} />
    </Box>
  );
}