import { Box, Button, Typography } from "@mui/material";
import { APP_BAR_HEIGHT } from "../../../theme";
import CustomizedMenus from "../../../components/Dropdown-workspace";

import AddCardIcon from "@mui/icons-material/AddCard";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect, useRef } from "react";
import type { ProjectUpdate } from "../../../apis/projects";

import TaskCard from "../../../components/taskCard";
import TaskInput from "../../../components/TaskInput";

const COLUMN_HEADER = "50px";
const COLUMN_FOOTER = "58px";
const BOARD_HEADER = "40px";

interface BoardHeaderProps {
  project: ProjectUpdate | null;
}

export default function BoardMain({ project }: BoardHeaderProps) {
  const [showTaskInput, setShowTaskInput] = useState<{
    [key: number]: boolean;
  }>({});
  const taskInputRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  console.log("project", project);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Kiểm tra xem click có nằm ngoài tất cả TaskInput không
      const isOutsideAllInputs = Object.values(taskInputRefs.current).every(
        (ref) => !ref?.contains(target)
      );

      if (isOutsideAllInputs) {
        setShowTaskInput({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTask = (taskIndex: number) => {
    setShowTaskInput((prev) => ({
      ...prev,
      [taskIndex]: true,
    }));
  };

  const handleCancelTask = (taskIndex: number) => {
    setShowTaskInput((prev) => ({
      ...prev,
      [taskIndex]: false,
    }));
  };

  const handleSaveTask = (
    taskIndex: number,
    taskName: string,
    description: string
  ) => {
    // TODO: Implement save task logic
    console.log("Saving task:", { taskIndex, taskName, description });

    setShowTaskInput((prev) => ({
      ...prev,
      [taskIndex]: false,
    }));
  };

  const renderTaskCard = () => {
    return project?.lstTask?.map((taskDetails, index) => {
      const isShowingInput = showTaskInput[index];
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: "300px",
            maxWidth: "300px",
            backgroundColor: "gray",
            borderRadius: "6px",
            maxHeight: `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_HEADER})`,
          }}
        >
          <Box
            sx={{
              height: COLUMN_HEADER,
              width: "100%",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {taskDetails.statusName}
            </Typography>
            <CustomizedMenus />
          </Box>

          <Box
            sx={{
              id: "box_content",
              display: "flex",
              flexDirection: "column",
              overflowX: "auto",
              overflowY: "auto",
              gap: 2,
              maxHeight: `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_HEADER} - ${COLUMN_HEADER}  - ${COLUMN_FOOTER})`,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
              "&::-webkit-scrollbar-button": {
                display: "none",
              },
            }}
          >
            <div className="p-1">
              {taskDetails.lstTaskDeTail?.map((item, index) => {
                return <TaskCard props={item} key={index} />;
              })}
            </div>

            {taskDetails.statusName === "BACKLOG" && isShowingInput && (
              <div
                ref={(el) => {
                  taskInputRefs.current[index] = el;
                }}
              >
                <TaskInput
                  onSave={(taskName, description) =>
                    handleSaveTask(index, taskName, description)
                  }
                  onCancel={() => handleCancelTask(index)}
                />
              </div>
            )}
          </Box>

          {taskDetails.statusName === "BACKLOG" && !isShowingInput && (
            <Box
              sx={{
                height: COLUMN_FOOTER,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={() => handleAddTask(index)}
              >
                Add new task
              </Button>
            </Box>
          )}
        </Box>
      );
    });
  };

  const [items] = useState([1, 2, 3]);
  return (
    <div>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          {renderTaskCard()}
        </Box>
      </SortableContext>
    </div>
  );
}
