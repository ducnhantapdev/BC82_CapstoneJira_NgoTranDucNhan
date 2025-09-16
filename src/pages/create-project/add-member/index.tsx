import { Modal } from "antd";
import AddUsersToProject from "./container/list-users";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface OpenProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

const AddmemberModal: React.FC<OpenProps> = ({ open, onClose, projectId }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    toast.success("Thêm thành viên thành công!");
    onClose();
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <>
      <Modal title="Add Member" open={open} onOk={handleOk} onCancel={onClose}>
        <AddUsersToProject projectId={projectId} />
      </Modal>
    </>
  );
};

export default AddmemberModal;
