import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { fetchProjects } from "../../../../redux/projectSlice";
import { setCurrentView } from "../../../../redux/viewSlice";

export default function ProjectsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAllProject = () => {
    dispatch(setCurrentView("projects"));
    dispatch(fetchProjects());
    handleClose();
  };

  return (
    <div>
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Projects <KeyboardArrowDownIcon />
        </Button>
        <Menu
          id="fade-menu"
          slotProps={{
            list: {
              "aria-labelledby": "fade-button",
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleViewAllProject}>View all projects</MenuItem>
          <MenuItem onClick={handleClose}>Create project</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
