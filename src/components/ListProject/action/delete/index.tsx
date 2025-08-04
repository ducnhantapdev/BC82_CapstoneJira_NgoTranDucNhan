import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import { deleteProject } from "../../../../apis/projects";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  projectId,
  onDelete,
}) => {
  const handleDelete = async (id: number) => {
    {
      try {
        await deleteProject(id);

        toast.success("Xóa thành công");
        onDelete();
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        toast.error("Error deleting project:");
        console.error("Xoá thất bại", error);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {`Bạn có chắc chắn muốn xóa project  ${
          projectId ? ` ${projectId}` : ""
        }?`}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={() => {
            handleDelete(projectId);
          }}
          color="error"
          variant="contained"
        >
          Xóa
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default DeleteDialog;
