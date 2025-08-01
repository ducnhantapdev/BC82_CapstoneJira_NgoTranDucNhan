import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { APP_BAR_HEIGHT } from "../../../theme";
import CustomizedMenus from "../../../components/Dropdown-workspace";

import DragHandleIcon from "@mui/icons-material/DragHandle";

const COLUMN_HEADER = "50px";
const COLUMN_FOOTER = "58px";
const BOARD_HEADER = "40px";

export default function Selected() {
  return (
    <div>
      <Box
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
            SELECTED FOR DEVELOPER
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
          <Typography sx={{ overflow: "unset", pl: 2 }}>content</Typography>
        </Box>
        <Box
          sx={{
            height: COLUMN_FOOTER,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tooltip title="Drag to move">
            <IconButton>
              <DragHandleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
}
