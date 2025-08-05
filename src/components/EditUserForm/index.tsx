import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { updateUser, type User, type editUser } from "../../apis/users";
import Toast from "../Toast";

interface EditUserFormProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function EditUserForm({
  open,
  onClose,
  user,
  onSuccess,
}: EditUserFormProps) {
  const [formData, setFormData] = useState<editUser>({
    id: "",
    passWord: "",
    email: "",
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.userId.toString(),
        passWord: "", // Không hiển thị password
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleChange =
    (field: keyof editUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await updateUser(user.userId, formData);
      setToast({
        open: true,
        message: "Cập nhật thông tin user thành công!",
        severity: "success",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      setToast({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật thông tin user!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      id: "",
      passWord: "",
      email: "",
      name: "",
      phoneNumber: "",
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              {user && (
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={user.avatar} sx={{ width: 64, height: 64 }} />
                  <Typography variant="h6">{user.name}</Typography>
                </Box>
              )}

              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                fullWidth
                required
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                fullWidth
                required
              />

              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                fullWidth
                required
              />

              <TextField
                label="Password"
                type="password"
                value={formData.passWord}
                onChange={handleChange("passWord")}
                fullWidth
                placeholder="Enter new password (leave blank to keep current)"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </DialogActions>
        </form>
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
