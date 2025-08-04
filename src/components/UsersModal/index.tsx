import { Modal, Typography, Box } from "@mui/material";
import UsersTable from "../UsersTable";

interface UsersModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UsersModal({ open, onClose }: UsersModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="users-modal-title"
      aria-describedby="users-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 1000,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography
          id="users-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
        >
          All Users
        </Typography>
        <UsersTable />
      </Box>
    </Modal>
  );
}
