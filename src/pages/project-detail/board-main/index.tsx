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
      dropIndex?: number
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
            // Thay đổi vị trí trong cùng column
            const currentTasks =
              task.lstTaskDeTail?.filter((t) => t.taskId !== taskId) || [];
            const insertIndex =
              dropIndex !== undefined ? dropIndex : currentTasks.length;
            const newTasks = [...currentTasks];
            newTasks.splice(insertIndex, 0, { ...draggedItem });

            return {
              ...task,
              lstTaskDeTail: newTasks,
            };
          } else if (task.statusId === draggedItem.statusId) {
            // Xóa task khỏi column cũ
            return {
              ...task,
              lstTaskDeTail:
                task.lstTaskDeTail?.filter((t) => t.taskId !== taskId) || [],
            };
          } else if (task.statusId === newStatusId) {
            // Thêm task vào column mới tại vị trí drop
            const currentTasks = task.lstTaskDeTail || [];
            // Điều chỉnh index nếu task được thêm vào column khác
            const adjustedIndex =
              draggedItem.statusId !== newStatusId ? dropIndex : dropIndex;
            const insertIndex =
              adjustedIndex !== undefined ? adjustedIndex : currentTasks.length;
            const newTasks = [...currentTasks];
            newTasks.splice(insertIndex, 0, { ...draggedItem });

            return {
              ...task,
              lstTaskDeTail: newTasks,
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
        const dropIndex =
          hoveredIndex !== null
            ? hoveredIndex
            : taskDetails.lstTaskDeTail?.length || 0;

        handleTaskUpdate(
          draggedItem.taskId,
          taskDetails.statusId,
          draggedItem,
          dropIndex
        );

        // Reset hoveredIndex sau khi drop
        setHoveredIndex(null);
      },
      hover: (draggedItem, monitor) => {
        const hoverBoundingRect = columnRef.current?.getBoundingClientRect();
        if (!hoverBoundingRect) return;

        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        const taskElements =
          columnRef.current?.querySelectorAll("[data-task-index]");
        if (taskElements) {
          let foundIndex = taskElements.length; // Mặc định là cuối

          // Logic cải tiến cho việc kéo thả - chỉ chèn khi kéo cao hơn task hiện có
          if (draggedItem.statusId !== taskDetails.statusId) {
            // Kéo từ column khác sang column mới
            for (let i = 0; i < taskElements.length; i++) {
              const element = taskElements[i] as HTMLElement;
              const rect = element.getBoundingClientRect();
              const elementTop = rect.top - hoverBoundingRect.top;
              const elementBottom = rect.bottom - hoverBoundingRect.top;

              // Chỉ chèn khi kéo cao hơn task hiện tại (hoverClientY < elementTop)
              // Nếu kéo vào giữa task, không thay đổi vị trí
              if (hoverClientY < elementTop) {
                foundIndex = i;
                break;
              } else if (
                hoverClientY >= elementTop &&
                hoverClientY <= elementBottom
              ) {
                // Kéo vào giữa task - giữ nguyên vị trí
                foundIndex = i;
                break;
              }
            }

            // Nếu kéo xuống dưới task cuối cùng - thêm vào cuối
            if (taskElements.length > 0) {
              const lastElement = taskElements[
                taskElements.length - 1
              ] as HTMLElement;
              const lastRect = lastElement.getBoundingClientRect();
              const lastBottom = lastRect.bottom - hoverBoundingRect.top;

              if (hoverClientY >= lastBottom) {
                foundIndex = taskElements.length;
              }
            }
          } else {
            // Logic cho cùng column - cần kéo cao hơn để thay đổi vị trí
            for (let i = 0; i < taskElements.length; i++) {
              const element = taskElements[i] as HTMLElement;
              const rect = element.getBoundingClientRect();
              const elementTop = rect.top - hoverBoundingRect.top;
              const elementBottom = rect.bottom - hoverBoundingRect.top;

              // Chỉ thay đổi vị trí khi kéo cao hơn task hiện tại
              if (hoverClientY < elementTop) {
                foundIndex = i;
                break;
              } else if (
                hoverClientY >= elementTop &&
                hoverClientY <= elementBottom
              ) {
                // Kéo vào giữa task - giữ nguyên vị trí
                foundIndex = i;
                break;
              }
            }

            // Xử lý task cuối cùng - thêm vào cuối nếu kéo xuống dưới
            if (taskElements.length > 0) {
              const lastElement = taskElements[
                taskElements.length - 1
              ] as HTMLElement;
              const lastRect = lastElement.getBoundingClientRect();
              const lastBottom = lastRect.bottom - hoverBoundingRect.top;

              if (hoverClientY >= lastBottom) {
                foundIndex = taskElements.length;
              }
            }
          }

          setHoveredIndex(foundIndex);
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
          backgroundColor: isOverCurrent ? "#f5f5f5" : "#F3F4F6",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          transform: isOverCurrent ? "scale(1.02)" : "scale(1)",
          boxShadow: isOverCurrent
            ? "0 8px 16px rgba(25, 118, 210, 0.2)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          // Hiệu ứng kéo task ra khỏi column
          "&::before": isOverCurrent
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "3px dashed #1976d2",
                borderRadius: "8px",
                pointerEvents: "none",
                zIndex: 1,
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 0.6 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.6 },
                },
              }
            : {},
          position: "relative",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
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
          {taskDetails.lstTaskDeTail?.map((item, index) => {
            // Debug: Log task item data
            console.log("Task item:", item);
            return (
              <Box
                key={item.taskId}
                data-task-index={index}
                sx={{
                  transform:
                    hoveredIndex === index
                      ? "translateY(8px)"
                      : "translateY(0)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  "&::before":
                    hoveredIndex === index
                      ? {
                          content: '""',
                          position: "absolute",
                          top: "-4px",
                          left: 0,
                          right: 0,
                          height: "3px",
                          backgroundColor: "#1976d2",
                          borderRadius: "2px",
                          boxShadow: "0 2px 4px rgba(25, 118, 210, 0.3)",
                        }
                      : {},
                  "&::after":
                    hoveredIndex === index
                      ? {
                          content: '""',
                          position: "absolute",
                          top: "-8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "0",
                          height: "0",
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: "6px solid #1976d2",
                        }
                      : {},
                  // Hiệu ứng kéo ra khỏi column
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 10,
                  },
                  // Hiệu ứng khi đang kéo task
                  "& .dragging": {
                    transform: "rotate(5deg) scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                    zIndex: 100,
                    opacity: 0.8,
                  },
                }}
              >
                <TaskCard props={{ ...item, statusId: taskDetails.statusId }} />
              </Box>
            );
          })}

          {/* Hiển thị drop zone khi hover ở cuối column */}
          {hoveredIndex === taskDetails.lstTaskDeTail?.length && (
            <Box
              sx={{
                height: "60px",
                border: "2px dashed #1976d2",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                marginTop: "8px",
                transition: "all 0.2s ease",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  opacity: 0.6,
                },
              }}
            />
          )}
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
