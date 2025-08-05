import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { deleteUser, type User } from "../../apis/users";
import Toast from "../Toast";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: () => void;
}

export default function DeleteUserDialog({
  open,
  onClose,
  user,
  onDelete,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleDelete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await deleteUser(user.userId);
      setToast({
        open: true,
        message: "Xóa user thành công!",
        severity: "success",
      });
      onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      setToast({
        open: true,
        message: "Có lỗi xảy ra khi xóa user!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {user && (
              <Avatar src={user.avatar} sx={{ width: 48, height: 48 }} />
            )}
            <Box>
              <Typography variant="h6">
                Are you sure you want to delete this user?
              </Typography>
              {user && (
                <Typography variant="body2" color="text.secondary">
                  {user.name} ({user.email})
                </Typography>
              )}
            </Box>
          </Box>
          <Typography variant="body2" color="error">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}
