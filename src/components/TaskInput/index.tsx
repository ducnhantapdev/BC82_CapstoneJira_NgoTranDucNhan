import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAllTaskType, getAllPriority } from "../../apis/projects";

interface TaskInputProps {
  onSave: (
    taskName: string,
    description: string,
    typeId: number,
    priorityId: number
  ) => void;
  onCancel: () => void;
  projectId: number;
}

interface TaskType {
  id: number;
  taskType: string;
}

interface Priority {
  priorityId: number;
  priority: string;
}

export default function TaskInput({ onSave, onCancel }: TaskInputProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number>(1);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number>(1);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, prioritiesData] = await Promise.all([
          getAllTaskType(),
          getAllPriority(),
        ]);
        // Cast the response data to the correct types
        setTaskTypes(typesData as any);
        setPriorities(prioritiesData as any);
      } catch (error) {
        console.error("Error fetching task types and priorities:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (taskName.trim()) {
      setLoading(true);
      try {
        await onSave(
          taskName.trim(),
          description.trim(),
          selectedTypeId,
          selectedPriorityId
        );
        setTaskName("");
        setDescription("");
        setSelectedTypeId(1);
        setSelectedPriorityId(1);
      } catch (error) {
        console.error("Error saving task:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setTaskName("");
    setDescription("");
    setSelectedTypeId(1);
    setSelectedPriorityId(1);
    onCancel();
  };

  return (
    <Box
      sx={{
        padding: "12px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        width: "100%",
        marginTop: "8px",
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Nhập tên task..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        sx={{ marginBottom: "8px" }}
        autoFocus
      />

      <TextField
        fullWidth
        size="small"
        placeholder="Mô tả task (tùy chọn)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={2}
        sx={{ marginBottom: "8px" }}
      />

      <Box sx={{ display: "flex", gap: 1, marginBottom: "8px" }}>
        <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
          <InputLabel>Loại task</InputLabel>
          <Select
            value={selectedTypeId}
            label="Loại task"
            onChange={(e) => setSelectedTypeId(e.target.value as number)}
          >
            {taskTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.taskType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
          <InputLabel>Độ ưu tiên</InputLabel>
          <Select
            value={selectedPriorityId}
            label="Độ ưu tiên"
            onChange={(e) => setSelectedPriorityId(e.target.value as number)}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority.priorityId} value={priority.priorityId}>
                {priority.priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={loading || !taskName.trim()}
        >
          {loading ? "Đang tạo..." : "Tạo task"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCancel}
          disabled={loading}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
