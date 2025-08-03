import { Box, Typography, Button } from "@mui/material";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddCardIcon from "@mui/icons-material/AddCard";
import { useRef, useEffect, useState, useCallback } from "react";

import TaskCard from "../../../components/taskCard";
import type { ProjectUpdate, Task, TaskDetail } from "../../../apis/projects";
import { updateStatus } from "../../../apis/projects";

interface BoardMainProps {
  project: ProjectUpdate | null;
}

const COLUMN_HEADER = "50px";
const COLUMN_FOOTER = "58px";

export default function BoardMain({ project }: BoardMainProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localProject, setLocalProject] = useState(project);

  // Cập nhật local state khi project prop thay đổi
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const handleTaskUpdate = useCallback(
    async (
      taskId: number,
      newStatusId: number,
      draggedItem: TaskDetail & { statusId: number },
      targetIndex?: number
    ) => {
      if (isUpdating) return;

      setIsUpdating(true);

      // Cập nhật UI ngay lập tức
      setLocalProject((prevProject) => {
        if (!prevProject) return prevProject;

        const updatedProject = { ...prevProject };
        const newLstTask = updatedProject.lstTask.map((task) => {
          if (
            task.statusId === draggedItem.statusId &&
            task.statusId === newStatusId
          ) {
            // Hoán đổi vị trí trong cùng column
            const currentTasks = [...(task.lstTaskDeTail || [])];
            const draggedIndex = currentTasks.findIndex(
              (t) => t.taskId === taskId
            );

            if (draggedIndex !== -1 && targetIndex !== undefined) {
              // Xóa task khỏi vị trí cũ
              currentTasks.splice(draggedIndex, 1);
              // Chèn task vào vị trí mới
              currentTasks.splice(targetIndex, 0, draggedItem);

              return {
                ...task,
                lstTaskDeTail: currentTasks,
              };
            }
            return task;
          } else if (task.statusId === draggedItem.statusId) {
            // Xóa task khỏi column cũ
            return {
              ...task,
              lstTaskDeTail:
                task.lstTaskDeTail?.filter((t) => t.taskId !== taskId) || [],
            };
          } else if (task.statusId === newStatusId) {
            // Thêm task vào column mới
            const targetIdx =
              targetIndex !== undefined
                ? targetIndex
                : task.lstTaskDeTail?.length || 0;
            const currentTasks = [...(task.lstTaskDeTail || [])];
            currentTasks.splice(targetIdx, 0, draggedItem);

            return {
              ...task,
              lstTaskDeTail: currentTasks,
            };
          }
          return task;
        });

        return { ...updatedProject, lstTask: newLstTask };
      });

      try {
        await updateStatus({
          taskId,
          statusId: newStatusId,
        });
        console.log("Task status updated successfully");
      } catch (err) {
        console.error("Lỗi cập nhật status:", err);
        // Revert UI nếu có lỗi
        setLocalProject(project);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, project]
  );

  const DroppableColumn = ({ taskDetails }: { taskDetails: Task }) => {
    const columnRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const [{ isOverCurrent }, drop] = useDrop<
      TaskDetail & { statusId: number },
      void,
      { isOverCurrent: boolean }
    >({
      accept: "TASK",
      drop: (draggedItem) => {
        if (draggedItem.statusId === taskDetails.statusId) {
          // Hoán đổi vị trí trong cùng column
          handleTaskUpdate(
            draggedItem.taskId,
            taskDetails.statusId,
            draggedItem,
            hoveredIndex || 0
          );
        } else {
          // Di chuyển sang column khác
          handleTaskUpdate(
            draggedItem.taskId,
            taskDetails.statusId,
            draggedItem,
            hoveredIndex || undefined
          );
        }
      },
      hover: (draggedItem, monitor) => {
        if (draggedItem.statusId !== taskDetails.statusId) return;

        const hoverBoundingRect = columnRef.current?.getBoundingClientRect();
        if (!hoverBoundingRect) return;

        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Tìm index của task đang hover
        const taskElements =
          columnRef.current?.querySelectorAll("[data-task-index]");
        if (taskElements) {
          for (let i = 0; i < taskElements.length; i++) {
            const element = taskElements[i] as HTMLElement;
            const rect = element.getBoundingClientRect();
            const elementMiddleY = (rect.bottom - rect.top) / 2;

            if (hoverClientY < elementMiddleY) {
              setHoveredIndex(i);
              break;
            }
            setHoveredIndex(i + 1);
          }
        }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    });

    useEffect(() => {
      if (columnRef.current) {
        drop(columnRef.current);
      }
    }, [drop]);

    return (
      <Box
        ref={columnRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minWidth: "300px",
          maxWidth: "300px",
          backgroundColor: isOverCurrent ? "#e0e0e0" : "gray",
          borderRadius: "6px",
          transition: "all 0.2s ease",
          transform: isOverCurrent ? "scale(1.02)" : "scale(1)",
          boxShadow: isOverCurrent ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: COLUMN_HEADER,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight="bold">{taskDetails.statusName}</Typography>
        </Box>

        {/* Task list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            gap: 2,
            px: 1,
          }}
        >
          {taskDetails.lstTaskDeTail?.map((item, index) => (
            <Box
              key={item.taskId}
              data-task-index={index}
              sx={{
                transform:
                  hoveredIndex === index ? "translateY(8px)" : "translateY(0)",
                transition: "transform 0.2s ease",
                position: "relative",
                "&::before":
                  hoveredIndex === index
                    ? {
                        content: '""',
                        position: "absolute",
                        top: "-4px",
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: "#1976d2",
                        borderRadius: "1px",
                      }
                    : {},
              }}
            >
              <TaskCard props={{ ...item, statusId: taskDetails.statusId }} />
            </Box>
          ))}
        </Box>

        {/* Footer (chỉ hiện cho BACKLOG) */}
        {taskDetails.statusName === "BACKLOG" && (
          <Box
            sx={{
              height: COLUMN_FOOTER,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new task</Button>
          </Box>
        )}
      </Box>
    );
  };

  if (!localProject) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {localProject.lstTask.map((taskDetails: Task) => (
          <DroppableColumn
            key={taskDetails.statusId}
            taskDetails={taskDetails}
          />
        ))}
      </Box>
    </DndProvider>
  );
}
