import { Box, Typography } from "@mui/material";

import { BOARD_CONTENT_HEIGHT } from "../../theme";

import BackLog from "./backlog";
import Selected from "./selected";
import Inprogress from "./ingroress";
import Done from "./done";

export default function ProjectDetail() {
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
          <div className="board-header flex justify-start items-center gap-2 pb-5">
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: "bold", width: "40%" }}
            >
              Board
            </Typography>
            <div className="members">
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "normal" }}>
                Memers :
              </Typography>
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Column 1*/}
            <BackLog />
            {/* Column 2*/}
            <Selected />
            {/* Column 3*/}
            <Inprogress />
            {/* Column 4*/}
            <Done />
          </Box>
        </Box>
      </div>
    </>
  );
}
