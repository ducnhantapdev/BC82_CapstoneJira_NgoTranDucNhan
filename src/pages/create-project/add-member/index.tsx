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
