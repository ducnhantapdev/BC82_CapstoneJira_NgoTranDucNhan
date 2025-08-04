import { useState, useEffect } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from "antd";

import TextArea from "antd/es/input/TextArea";
import {
  getProjectsAPI,
  getProjectDetailById,
  getAllStatus,
  getAllPriority,
  getAllTaskType,
  createTask,
  type ProjectList,
  type ProjectUpdate,
  type Status,
  type Priority,
  type TaskType,
  type CreateTask,
} from "../../apis/projects";
import { toast, ToastContainer } from "react-toastify";

interface ApiError {
  response?: {
    data?: {
      content?: string;
    };
  };
  content?: string;
}

const { Option } = Select;

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

interface CreateTaskOnMenuProps {
  onTaskCreated?: () => void; // Callback để cập nhật giao diện
}

export default function CreateTaskOnMenu({
  onTaskCreated,
}: CreateTaskOnMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<ProjectList[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectUpdate | null>(
    null
  );
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [priorityList, setPriorityList] = useState<Priority[]>([]);
  const [taskTypeList, setTaskTypeList] = useState<TaskType[]>([]);

  // Lấy danh sách tất cả project
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjectsAPI();
        setProjects(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách project:", error);
      }
    };
    fetchProjects();
  }, []);

  // Lấy danh sách status, priority, taskType
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusData, priorityData, taskTypeData] = await Promise.all([
          getAllStatus(),
          getAllPriority(),
          getAllTaskType(),
        ]);
        console.log("Status data:", statusData);
        console.log("Priority data:", priorityData);
        console.log("TaskType data:", taskTypeData);
        setStatusList(statusData as unknown as Status[]);
        setPriorityList(priorityData as unknown as Priority[]);
        setTaskTypeList(taskTypeData as unknown as TaskType[]);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Khi chọn project, lấy chi tiết project để có danh sách members
  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (selectedProject) {
        try {
          const data = await getProjectDetailById(selectedProject);
          if (data) {
            setProjectDetail(data);
          }
        } catch (error) {
          console.error("Lỗi lấy chi tiết project:", error);
        }
      }
    };
    fetchProjectDetail();
  }, [selectedProject]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: {
    project: number;
    taskName: string;
    status: number;
    priority: number;
    taskType: number;
    assigners: number[];
    description: string;
  }) => {
    try {
      setLoading(true);

      const taskData: CreateTask = {
        listUserAsign: values.assigners || [],
        taskName: values.taskName,
        description: values.description,
        statusId: values.status,
        projectId: values.project,
        typeId: values.taskType,
        priorityId: values.priority,
      };

      await createTask(taskData);

      // Thông báo thành công
      toast.success("Tạo task thành công!");

      // Gọi callback để cập nhật giao diện
      if (onTaskCreated) {
        onTaskCreated();
      }

      // Đóng drawer và reset form
      onClose();
    } catch (error: unknown) {
      console.error("Lỗi tạo task:", error);

      // Hiển thị thông báo lỗi chi tiết
      const errorMessage =
        (error as ApiError)?.response?.data?.content ||
        (error as ApiError)?.content ||
        "Có lỗi xảy ra khi tạo task";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="cyan"
        variant="outlined"
        onClick={showDrawer}
        icon={<PlusOutlined />}
      >
        New task
      </Button>
      <Drawer
        title="Create a new Task"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={loading}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* Project */}
          <Col>
            <Form.Item
              name="project"
              label="Project"
              rules={[{ required: true, message: "Please select a project" }]}
            >
              <Select
                placeholder="Please select a project"
                onChange={(value) => setSelectedProject(value)}
              >
                {projects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.projectName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* Task name*/}
          <Col>
            <Form.Item
              name="taskName"
              label="Task Name"
              rules={[
                { required: true, message: "Please enter your task name" },
              ]}
            >
              <Input type="text" placeholder="Enter task name" />
            </Form.Item>
          </Col>
          {/* Status */}
          <Col>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Please select a status">
                {statusList.map((status) => (
                  <Option key={status.statusId} value={status.statusId}>
                    {status.statusName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* Priority & Task type */}
          <Row gutter={16}>
            {/* Priority*/}
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: "Please select Priority" }]}
              >
                <Select placeholder="Please select Priority">
                  {priorityList.map((priority, index) => (
                    <Option
                      key={priority?.priorityId || index}
                      value={priority?.priorityId || "1"}
                    >
                      {priority?.priority ||
                        priority?.projectCategoryName ||
                        `Priority ${index + 1}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Task type */}
            <Col span={12}>
              <Form.Item
                name="taskType"
                label="Task Type"
                rules={[
                  {
                    required: true,
                    message: "Please select a Task Type",
                  },
                ]}
              >
                <Select placeholder="Please select a TaskType">
                  {taskTypeList.map((type, index) => (
                    <Option key={type?.id || index} value={type?.id}>
                      {type?.taskType ||
                        type?.taskType ||
                        `Task Type ${index + 1}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* Assignees and Time tracking */}
          <Row gutter={16}>
            {/* Assignees*/}
            <Col span={24}>
              <Form.Item
                name="assigners"
                label="Assigners"
                rules={[{ required: true, message: "Please select assigners" }]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Select assigners"
                  onChange={handleChange}
                >
                  {projectDetail?.members?.map((member) => {
                    const memberData = member as {
                      userId: number;
                      name: string;
                    };
                    return (
                      <Option key={memberData.userId} value={memberData.userId}>
                        {memberData.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* Description */}
          <Row gutter={16}>
            {/* Assignees*/}
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <TextArea placeholder="Enter task description"></TextArea>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ToastContainer />
      </Drawer>
    </>
  );
}
