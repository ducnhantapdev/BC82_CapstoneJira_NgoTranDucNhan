import { Modal } from "antd";
import AddUsersToProject from "./container/list-users";

interface OpenProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

const AddmemberModal: React.FC<OpenProps> = ({ open, onClose, projectId }) => {
  return (
    <>
      <Modal title="Add Member" open={open} onOk={onClose} onCancel={onClose}>
        <AddUsersToProject projectId={projectId} />
      </Modal>
    </>
  );
};

export default AddmemberModal;
