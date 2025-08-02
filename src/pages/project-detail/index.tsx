import { Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectDetail,
  clearCurrentProject,
} from "../../redux/projectSlice";
import type { AppDispatch, RootState } from "../../redux/store";

import { BOARD_CONTENT_HEIGHT } from "../../theme";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import BoardHeader from "./header";
import BoardMain from "./board-main";
import type { ProjectDetail } from "../../apis/projects";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentProject, loading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch]);

  const handleDragEnd = (e: DragEndEvent) => {
    console.log("event", e);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="project-detais w-full">
          {/* Box */}
          <Box
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
              pt: 2,
              height: BOARD_CONTENT_HEIGHT,
            }}
          >
            <BoardHeader project={currentProject} />
            <DndContext>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Column 1*/}
                <BoardMain project={currentProject} />
              </Box>
            </DndContext>
          </Box>
        </div>
      </DndContext>
    </>
  );
}
