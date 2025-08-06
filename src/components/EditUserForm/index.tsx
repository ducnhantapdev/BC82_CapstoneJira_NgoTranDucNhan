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

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  passWord?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [isOwnAccount, setIsOwnAccount] = useState(true);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Tên không được để trống";
    }
    if (name.trim().length < 2) {
      return "Tên phải có ít nhất 2 ký tự";
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email không được để trống";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không đúng định dạng";
    }
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return "Số điện thoại không được để trống";
    }
    // Regex cho số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại không đúng định dạng Việt Nam";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (password && password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.name = validateName(formData.name);
    newErrors.email = validateEmail(formData.email);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    newErrors.passWord = validatePassword(formData.passWord);

    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.userId.toString(),
        passWord: "", 
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
      });
      setErrors({}); 
      // Kiểm tra user hiện tại có phải là user đang được chỉnh sửa không
      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          console.log("Current user from localStorage:", currentUser);
          console.log("User being edited:", user);
        
          const currentUserId = currentUser.userId;
          const editingUserId = user.userId;
          console.log("Current user ID:", currentUserId, "Editing user ID:", editingUserId);
          setIsOwnAccount(currentUserId === editingUserId);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setIsOwnAccount(false);
        }
      } else {
        console.log("No user found in localStorage");
        setIsOwnAccount(false);
      }
    }
  }, [user]);

  const handleChange =
    (field: keyof editUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      
      // Clear error for this field when user starts typing
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    // Validate form before submission
    if (!validateForm()) {
      setToast({
        open: true,
        message: "Vui lòng kiểm tra lại thông tin!",
        severity: "error",
      });
      return;
    }

    // Kiểm tra lại trước khi update
    const currentUserStr = localStorage.getItem("user");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const currentUserId = currentUser.userId || currentUser.id || currentUser.user_id;
        if (currentUserId !== user.userId) {
          setToast({
            open: true,
            message: "Bạn chỉ có thể chỉnh sửa tài khoản của chính mình!",
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

    // Nếu mật khẩu để trống, giữ nguyên mật khẩu cũ
    let dataToUpdate = { ...formData };
    if (!formData.passWord) {

      dataToUpdate.passWord = (user as any).passWord || (user as any).password || undefined;
    }

    try {
      setLoading(true);
      await updateUser(user.userId, dataToUpdate);
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
    setErrors({});
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
              {!isOwnAccount && (
                <Typography color="error" variant="body2">
                  Bạn chỉ có thể chỉnh sửa tài khoản của chính mình.
                </Typography>
              )}

              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                fullWidth
                required
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />

              <TextField
                label="Password"
                type="password"
                value={formData.passWord}
                onChange={handleChange("passWord")}
                fullWidth
                placeholder="Enter new password (leave blank to keep current)"
                error={!!errors.passWord}
                helperText={errors.passWord}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading || !isOwnAccount}>
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
