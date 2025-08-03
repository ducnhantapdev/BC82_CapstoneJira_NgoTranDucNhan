import { Box, Card, Chip, Typography, Avatar } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { useDrag } from "react-dnd";
import { useRef, useEffect } from "react";
import type { TaskDetail } from "../../apis/projects";

interface PropsFromBoardMain {
  props: TaskDetail & { statusId: number }; // cần thêm statusId để xác định column cũ
}

const TaskCard = ({ props }: PropsFromBoardMain) => {
  const cardRef = useRef<HTMLDivElement>(null);
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
    <Box ref={cardRef}>
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
          <Chip
            icon={<RadioButtonUncheckedIcon style={{ color: "#f44336" }} />}
            label={props.priority || "Medium"}
            size="small"
            variant="outlined"
            sx={{
              color: "#333",
              borderColor: "#ddd",
              fontWeight: 500,
            }}
          />

          <Box flexGrow={1} />

          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: "#e0e0e0",
            }}
          >
            <PersonOutlineIcon fontSize="small" />
          </Avatar>
        </Box>
      </Card>
    </Box>
  );
};

export default TaskCard;
