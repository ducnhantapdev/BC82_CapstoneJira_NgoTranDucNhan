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

import BoardHeader from "./header";
import BoardMain from "./board-main";
import type { ProjectDetail } from "../../apis/projects";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentProject, loading } = useSelector(
    (state: RootState) => state.projects
  );

  const refreshProjectData = () => {
    if (id) {
      dispatch(fetchProjectDetail(parseInt(id)));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch]);

  // Debug: Log current project data
  useEffect(() => {
    if (currentProject) {
      console.log("Current project data:", currentProject);
    }
  }, [currentProject]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
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
          <BoardHeader project={currentProject} onProjectUpdate={refreshProjectData} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            {/* Column 1*/}
            <BoardMain project={currentProject} />
          </Box>
        </Box>
      </div>
    </>
  );
}
