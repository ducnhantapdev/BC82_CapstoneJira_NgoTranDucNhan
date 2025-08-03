// components/Column.tsx
import { Box, Typography, Button } from "@mui/material";
import { useDrop } from "react-dnd";
import AddCardIcon from "@mui/icons-material/AddCard";

import { useState, useRef } from "react";
import { type Task, type TaskDetail, updateStatus } from "../../apis/projects";
import CustomizedMenus from "../Dropdown-workspace";
import TaskCard from "../taskCard";
import TaskInput from "../TaskInput";

interface ColumnProps {
  taskDetails: Task;
  index: number;
  projectId: number;
  onTaskMoved: () => void;
}

export default function Column({
  taskDetails,
  index,
  projectId,
  onTaskMoved,
}: ColumnProps) {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: "TASK",
    drop: async (dragged: TaskDetail & { statusId: number }) => {
      if (dragged.statusId === taskDetails.statusId) return;

      try {
        await updateStatus({
          taskId: dragged.taskId,
          statusId: taskDetails.statusId,
        });
        onTaskMoved(); // callback để load lại project
      } catch (err) {
        console.error("Lỗi cập nhật status:", err);
      }
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "300px",
        maxWidth: "300px",
        backgroundColor: "gray",
        borderRadius: "6px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "50px",
          width: "100%",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight="bold">{taskDetails.statusName}</Typography>
        <CustomizedMenus />
      </Box>

      {/* Tasks */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          gap: 2,
          px: 1,
        }}
      >
        {taskDetails.lstTaskDeTail?.map((item, i) => (
          <TaskCard
            props={{ ...item, statusId: taskDetails.statusId }}
            key={i}
          />
        ))}

        {taskDetails.statusName === "BACKLOG" && showInput && (
          <div ref={inputRef}>
            <TaskInput
              onSave={() => setShowInput(false)}
              onCancel={() => setShowInput(false)}
            />
          </div>
        )}
      </Box>

      {/* Footer */}
      {taskDetails.statusName === "BACKLOG" && !showInput && (
        <Box
          sx={{
            height: "58px",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            startIcon={<AddCardIcon />}
            onClick={() => setShowInput(true)}
          >
            Add new task
          </Button>
        </Box>
      )}
    </Box>
  );
}
