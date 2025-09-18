import Box from "@mui/material/Box";
import Logo from "../../assets/ico.png";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { setSearchTerm as setProjectSearchTerm } from "../../redux/projectSlice";
import { setSearchTerm as setUserSearchTerm } from "../../redux/userSlice";
import theme from "../../theme";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { setSearchMode } from "../../redux/projectSlice";
import MenuIcon from "@mui/icons-material/Menu";

import CreateTaskOnMenu from "../createTaskOnMenu";
import ProjectsMenu from "./menu/project";
import UsersMenu from "./menu/users";
import SearchBox from "./menu/search";

import AccoutMenu from "./menu/account-menu";
import * as React from "react";
import { fetchProjects } from "../../redux/projectSlice";
import { fetchUsers } from "../../redux/userSlice";
import { setCurrentView } from "../../redux/viewSlice";
import SearchIcon from "@mui/icons-material/Search";

export default function AppBar() {
  const dispatch = useDispatch<AppDispatch>();
  const [burgerAnchorEl, setBurgerAnchorEl] =
    React.useState<null | HTMLElement>(null);
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
  const isBurgerOpen = Boolean(burgerAnchorEl);

  const openBurger = (event: React.MouseEvent<HTMLElement>) => {
    setBurgerAnchorEl(event.currentTarget);
  };
  const closeBurger = () => setBurgerAnchorEl(null);

  const handleBurgerProjects = () => {
    dispatch(setCurrentView("projects"));
    dispatch(fetchProjects());
    closeBurger();
  };

  const handleBurgerUsers = () => {
    dispatch(setCurrentView("users"));
    dispatch(fetchUsers());
    closeBurger();
  };
  const [openSearchDialog, setOpenSearchDialog] = React.useState(false);
  const openSearch = () => setOpenSearchDialog(true);
  const closeSearch = () => setOpenSearchDialog(false);
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
            <IconButton
              onClick={openBurger}
              sx={{
                padding: 0,
                display: "none",
                "@media (max-width:430px)": { display: "inline-flex" },
              }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={burgerAnchorEl}
              open={isBurgerOpen}
              onClose={closeBurger}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleBurgerProjects}>Project</MenuItem>
              <MenuItem onClick={handleBurgerUsers}>User</MenuItem>
            </Menu>
            <img
              src={Logo}
              alt="logo"
              className="max-w-full max-h-full cursor-pointer"
              onClick={() => navigate("/")}
            />
            <span className="text-2xl font-bold">Jira</span>
            <div style={{ display: "inline-flex" }} className="">
              {/* Ẩn trên màn nhỏ <430px */}
              <div style={{ display: "inline-flex" }} className="">
                <div style={{ display: "inline-flex" }} className="">
                  <div
                    style={{
                      display: "inline-flex",
                    }}
                  >
                    <div style={{ display: "inline-flex" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          // Ẩn khi nhỏ hơn 430px
                          // MUI sx không dùng được trên div thường, dùng style + media query trong CSS-in-JS tại container cha
                        }}
                      >
                        {/* Hiển thị bình thường và ẩn khi <430px bằng sx trên từng component */}
                        <Box
                          sx={{
                            display: "inline-flex",
                            "@media (max-width:430px)": { display: "none" },
                          }}
                        >
                          <ProjectsMenu />
                        </Box>
                        <Box
                          sx={{
                            display: "inline-flex",
                            "@media (max-width:430px)": { display: "none" },
                          }}
                        >
                          <UsersMenu />
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CreateTaskOnMenu
              onTaskCreated={() => {
                // Refresh page hoặc reload data khi tạo task thành công
                window.location.reload();
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <IconButton aria-label="search" onClick={openSearch}>
              <SearchIcon />
            </IconButton>

            <AccoutMenu />
          </div>
        </div>
        {/* Search cũ đã được ẩn, dùng popup search thay thế */}
        <Dialog
          open={openSearchDialog}
          onClose={closeSearch}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Tìm kiếm</DialogTitle>
          <DialogContent>
            {currentView === "projects" && (
              <FormControl size="small" sx={{ minWidth: 120, mt: 1, mb: 2 }}>
                <InputLabel id="search-mode-label-dialog">Mode</InputLabel>
                <Select
                  labelId="search-mode-label-dialog"
                  id="search-mode-select-dialog"
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
          </DialogContent>
          <DialogActions>
            <Button onClick={closeSearch}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}
