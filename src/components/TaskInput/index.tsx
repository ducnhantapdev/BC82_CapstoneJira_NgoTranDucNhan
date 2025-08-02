import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

interface TaskInputProps {
  onSave: (taskName: string, description: string) => void;
  onCancel: () => void;
}

export default function TaskInput({ onSave, onCancel }: TaskInputProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (taskName.trim()) {
      onSave(taskName.trim(), description.trim());
      setTaskName("");
      setDescription("");
    }
  };

  const handleCancel = () => {
    setTaskName("");
    setDescription("");
    onCancel();
  };

  return (
    <Box
      sx={{
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        width: "100%",
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

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={!taskName.trim()}
        >
          Lưu
        </Button>
        <Button variant="outlined" size="small" onClick={handleCancel}>
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
