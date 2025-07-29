import { Modal } from "antd";

interface OpenProps {
  open: boolean;
  onClose: () => void;
}

const AddmemberModal: React.FC<OpenProps> = ({ open, onClose }) => {
  return (
    <>
      <Modal title="Add Member" open={open} onOk={onClose} onCancel={onClose}>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default AddmemberModal;
