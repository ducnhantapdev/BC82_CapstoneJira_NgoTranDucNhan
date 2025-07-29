import Box from "@mui/material/Box";
import Logo from "../../assets/ico.png";
import ProjectsMenu from "./menu/project";
import UsersMenu from "./menu/users";

import Button from "@mui/material/Button";

import AccoutMenu from "./menu/account-menu";
import SettingMenu from "./menu/setting-icon";
import { useNavigate } from "react-router-dom";

import SearchBox from "./menu/search";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { setSearchTerm } from "../../redux/projectSlice";

export default function AppBar() {
  const dispatch = useDispatch<AppDispatch>();
  const searchText = useSelector(
    (state: RootState) => state.projects.searchTerm
  );
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        color: (theme) => theme.palette.primary.main,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        width: "100%",
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
            <Button variant="outlined">Create Task</Button>
          </div>
          <div className="flex gap-2 items-center">
            <SearchBox
              value={searchText}
              onChange={(value: string) => {
                dispatch(setSearchTerm(value));
              }}
            />
            <SettingMenu />
            <AccoutMenu />
          </div>
        </div>
      </div>
    </Box>
  );
}
