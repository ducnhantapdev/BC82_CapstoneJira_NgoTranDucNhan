import { useState, useEffect } from "react";
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
  const [isOwnAccount, setIsOwnAccount] = useState(true);

  useEffect(() => {
    if (user) {
      // Kiểm tra user hiện tại có phải là user đang được xóa không
      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          console.log("Current user from localStorage (delete):", currentUser);
          console.log("User being deleted:", user);
          // Kiểm tra nhiều trường có thể chứa id
          const currentUserId = currentUser.userId || currentUser.id || currentUser.user_id;
          const deletingUserId = user.userId;
          console.log("Current user ID (delete):", currentUserId, "Deleting user ID:", deletingUserId);
          setIsOwnAccount(currentUserId === deletingUserId);
        } catch (error) {
          console.error("Error parsing user from localStorage (delete):", error);
          setIsOwnAccount(false);
        }
      } else {
        console.log("No user found in localStorage (delete)");
        setIsOwnAccount(false);
      }
    }
  }, [user]);

  const handleDelete = async () => {
    if (!user) return;

    // Kiểm tra lại trước khi xóa
    const currentUserStr = localStorage.getItem("user");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const currentUserId = currentUser.userId || currentUser.id || currentUser.user_id;
        if (currentUserId !== user.userId) {
          setToast({
            open: true,
            message: "Bạn chỉ có thể xóa tài khoản của chính mình!",
            severity: "error",
          });
          return;
        }
      } catch (error) {
        setToast({
          open: true,
          message: "Có lỗi xảy ra khi kiểm tra quyền!",
          severity: "error",
        });
        return;
      }
    }

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
          {!isOwnAccount && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              Bạn chỉ có thể xóa tài khoản của chính mình.
            </Typography>
          )}
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
            disabled={loading || !isOwnAccount}
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
