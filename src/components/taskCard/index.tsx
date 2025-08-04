import { Box, Card, Chip, Typography, Avatar, Tooltip } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PestControlIcon from "@mui/icons-material/PestControl";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { useDrag } from "react-dnd";
import { useRef, useEffect, useState } from "react";
import type { TaskDetail } from "../../apis/projects";
import TaskModal from "../taskModal";

interface PropsFromBoardMain {
  props: TaskDetail & { statusId: number };
}

const TaskCard = ({ props }: PropsFromBoardMain) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  console.log("TaskCard props:", props);
  console.log("priority:", props.priorityTask);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: props,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (cardRef.current) {
      drag(cardRef.current);
    }
  }, [drag]);

  return (
    <>
      <Box ref={cardRef} onClick={handleOpen}>
        <Card
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: 2,
            boxShadow: isDragging ? 4 : 1,
            marginBottom: 1,
            opacity: isDragging ? 0.5 : 1,
            transform: isDragging ? "rotate(5deg)" : "rotate(0deg)",
            transition: "all 0.2s ease",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            {props.taskName}
          </Typography>

          <Box display="flex" alignItems="center" mt={1}>
            <Box display="flex" gap={1}>
              {/* Task Type Chip */}
              <Chip
                icon={
                  props.taskType?.toLowerCase() === "bug" ||
                  props.taskName?.toLowerCase().includes("bug") ? (
                    <PestControlIcon style={{ color: "#f44336" }} />
                  ) : props.taskType?.toLowerCase() === "new task" ||
                    props.taskName?.toLowerCase().includes("new") ? (
                    <AddTaskIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <RadioButtonUncheckedIcon style={{ color: "#f44336" }} />
                  )
                }
                label={props.taskType}
                size="small"
                variant="outlined"
                sx={{
                  color: "#333",
                  borderColor: "#ddd",
                  fontWeight: 500,
                }}
              />

              {/* Priority Chip */}
              <Chip
                label={props.priorityTask?.priority || "Medium"}
                size="small"
                variant="outlined"
                sx={{
                  color: "#333",
                  borderColor: "#ddd",
                  fontWeight: 500,
                }}
              />
            </Box>

            <Box flexGrow={1} />

            {/* Assignees with limit */}
            <Box display="flex" alignItems="center" gap={0.5}>
              {props.assigness?.slice(0, 3).map((assigner) => (
                <Tooltip
                  key={assigner.userId}
                  title={assigner.name || "Unknown User"}
                  arrow
                >
                  <Avatar
                    src={assigner.avatar}
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.1)",
                        transition: "transform 0.2s ease",
                      },
                    }}
                  />
                </Tooltip>
              ))}

              {/* Show +N if there are more than 3 assignees */}
              {props.assigness && props.assigness.length > 3 && (
                <Tooltip
                  title={`${props.assigness.length - 3} more assignees`}
                  arrow
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#666",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#d0d0d0",
                        transform: "scale(1.1)",
                        transition: "transform 0.2s ease",
                      },
                    }}
                  >
                    +{props.assigness.length - 3}
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Card>
      </Box>

      <TaskModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TaskCard;
