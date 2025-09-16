import { Modal } from "antd";
import AddUsersToProject from "./container/list-users";


interface OpenProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

const AddmemberModal: React.FC<OpenProps> = ({ open, onClose, projectId }) => {
  const handleOk = () => {
    onClose();
<<<<<<< HEAD
    setTimeout(() => {
      navigate("/");
    }, 800);
=======
>>>>>>> da7fa4ae80a3afeeb6e9e72046058cad69a8ada4
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
