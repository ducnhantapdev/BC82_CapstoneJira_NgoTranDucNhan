import React from "react";
import { Modal, Select, Tag, Avatar, Typography, Divider, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
}

const assignees = [
  { label: "wewewerrr2", value: "wewewerrr2", initials: "WE" },
  { label: "koko", value: "koko", initials: "KO" },
  { label: "test1", value: "test1", initials: "TE" },
  { label: "duc nhan", value: "duc nhan", initials: "DN" },
];

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      title={<Tag color="red">Bug</Tag>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      closeIcon={<span style={{ fontSize: 18 }}>×</span>}
    >
      <div style={{ display: "flex", gap: 24 }}>
        {/* Left side */}
        <div style={{ flex: 2 }}>
          <Title level={5}>new task</Title>
          <Text>Description</Text>
          <p>new task</p>

          <Divider />
          <Text>Comments</Text>
        </div>

        {/* Right side */}
        <div style={{ flex: 1, borderLeft: "1px solid #eee", paddingLeft: 16 }}>
          <Text strong>Details</Text>
          <Divider />

          <Text>Assignees</Text>
          <div style={{ marginBottom: 16 }}>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select users"
              defaultValue={assignees.map((a) => a.value)}
              tagRender={({ label, value, closable, onClose }) => {
                const user = assignees.find((u) => u.value === value);
                return (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Avatar size="small">{user?.initials}</Avatar>
                    {label}
                  </Tag>
                );
              }}
            >
              {assignees.map((user) => (
                <Option key={user.value} value={user.value}>
                  {user.label}
                </Option>
              ))}
            </Select>
          </div>

          <Text>Priority</Text>
          <div style={{ margin: "8px 0" }}>
            <Tag color="gold">Medium</Tag>
          </div>

          <Text>Estimate</Text>
          <div style={{ margin: "8px 0" }}>
            <Tag>0m</Tag>
          </div>

          <Text>Time tracking</Text>
          <div style={{ margin: "8px 0" }}>
            <Text type="secondary">0m logged</Text> |{" "}
            <Text type="secondary">0m remaining</Text>
          </div>

          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
