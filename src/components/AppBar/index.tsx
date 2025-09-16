import Box from "@mui/material/Box";
import Logo from "../../assets/ico.png";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { setSearchTerm as setProjectSearchTerm } from "../../redux/projectSlice";
import { setSearchTerm as setUserSearchTerm } from "../../redux/userSlice";
import theme from "../../theme";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { setSearchMode } from "../../redux/projectSlice";

import CreateTaskOnMenu from "../createTaskOnMenu";
import ProjectsMenu from "./menu/project";
import UsersMenu from "./menu/users";
import SearchBox from "./menu/search";

import AccoutMenu from "./menu/account-menu";

export default function AppBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentView } = useSelector((state: RootState) => state.view);
  const projectSearchText = useSelector(
    (state: RootState) => state.projects.searchTerm
  );
  const userSearchText = useSelector(
    (state: RootState) => state.users.searchTerm
  );
  const projectSearchMode = useSelector(
    (state: RootState) => state.projects.searchMode
  );
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        color: (theme) => theme.palette.primary.main,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        width: "100%",
        height: theme.jiraCustom.appBarHeight,
        position: "sticky",
        zIndex: 1000,
      }}
    >
      <div className="max-w-[1200px] m-auto px-4 py-4">
        <div
          id="header"
          className="flex w-full h-[40px] justify-between items-center"
        >
          <div className="flex items-center w-full h-full gap-2">
            <img
              src={Logo}
              alt="logo"
              className="max-w-full max-h-full cursor-pointer"
              onClick={() => navigate("/")}
            />
            <span className="text-2xl font-bold">Jira</span>
            <ProjectsMenu />
            <UsersMenu />
            <CreateTaskOnMenu
              onTaskCreated={() => {
                // Refresh page hoặc reload data khi tạo task thành công
                window.location.reload();
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            {currentView === "projects" && (
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="search-mode-label">Mode</InputLabel>
                <Select
                  labelId="search-mode-label"
                  id="search-mode-select"
                  value={projectSearchMode}
                  label="Mode"
                  onChange={(e) =>
                    dispatch(setSearchMode(e.target.value as any))
                  }
                >
                  <MenuItem value="project">Project</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            )}
            <SearchBox
              value={
                currentView === "projects" ? projectSearchText : userSearchText
              }
              placeholder={
                currentView === "projects"
                  ? "Tìm kiếm project..."
                  : "Tìm kiếm user..."
              }
              onChange={(value: string) => {
                if (currentView === "projects") {
                  dispatch(setProjectSearchTerm(value));
                } else {
                  dispatch(setUserSearchTerm(value));
                }
              }}
            />

            <AccoutMenu />
          </div>
        </div>
      </div>
    </Box>
  );
}
