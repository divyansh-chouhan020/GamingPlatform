import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Typography, List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Button } from "@/components/common/uiComponents";

export function AdminGameTable({ games, onApprove, onReject }) {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Game Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Developer</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games?.map((game) => (
            <TableRow key={game._id}>
              <TableCell>{game.title}</TableCell>
              <TableCell sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {game.desc}
              </TableCell>
              <TableCell>
                {game.createdBy?.name || "Unknown"}
              </TableCell>
              <TableCell>
                <Chip
                  label={game.genre}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={game.status}
                  size="small"
                  color={game.status === "approved" ? "success" : "warning"}
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell>
                <ApprovalActions
                  onApprove={() => onApprove(game._id)}
                  onReject={() => onReject(game._id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function AdminSidebar() {
  const theme = useTheme();

  return (
    <Box
      component="aside"
      sx={{
        width: "220px",
        padding: "16px",
        borderRight: `1px solid ${theme.palette.mode === "dark"
          ? "rgba(56, 189, 248, 0.6)"
          : "rgba(56, 189, 248, 0.4)"}`,
      }}
    >
      <Typography variant="h6">Admin</Typography>
      <List>
        <ListItem>Games</ListItem>
        <ListItem>Users</ListItem>
        <ListItem>Reports</ListItem>
      </List>
    </Box>
  );
}

function ApprovalActions({ onApprove, onReject }) {
  return (
    <Box sx={{ display: "flex", gap: "8px" }}>
      <Button label="Approve" onClick={onApprove} />
      <Button
        label="Reject"
        variant="danger"
        onClick={onReject}
      />
    </Box>
  );
}

