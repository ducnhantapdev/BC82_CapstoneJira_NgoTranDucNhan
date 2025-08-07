import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { getUsersAPI, type User } from "../../../../../apis/users";
import {
  assignUserProject,
  removeUserFromProject,
  getProjectDetailById,
} from "../../../../../apis/projects";
import { toast } from "react-toastify";

interface projectIdParam {
  projectId: number;
}

// Hàm chuẩn hóa tiếng Việt (loại bỏ dấu, chuyển về chữ thường, loại bỏ khoảng trắng thừa)
function normalizeVN(str: string) {
  return str
    .normalize("NFD")
    .replace(/[ -]/g, (c) => c) // giữ ký tự ASCII
    .replace(/[ -]/g, (c) => c) // giữ ký tự ASCII
    .replace(/[ -]/g, (c) => c) // giữ ký tự ASCII
    .replace(/[ -]/g, (c) => c) // giữ ký tự ASCII
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, " ") // bỏ khoảng trắng thừa
    .trim()
    .toLowerCase()
    .replace(/\p{Diacritic}/gu, "");
}

export default function AddUsersToProject(projectId: projectIdParam) {
  const [listUsers, setListUser] = useState<User[]>([]);
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const id = projectId.projectId;

  useEffect(() => {
    getUser();
    getProjectUsers();
  }, []);

  // Debug: Log addedUsers whenever it changes
  useEffect(() => {
    console.log("Added users updated:", addedUsers);
  }, [addedUsers]);

  const getUser = async () => {
    try {
      const listUser = await getUsersAPI();
      setListUser(listUser);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectUsers = async () => {
    try {
      const projectDetail = await getProjectDetailById(id);
      console.log("Project detail response:", projectDetail);
      if (projectDetail && projectDetail.members) {
        // Convert members to User format, handling both name and userName properties
        const convertedMembers = projectDetail.members.map((member: any) => ({
          userId: member.userId,
          name: member.name || member.userName || '',
          avatar: member.avatar || '',
          email: member.email || '',
          phoneNumber: member.phoneNumber || ''
        }));
        setAddedUsers(convertedMembers);
      } else {
        setAddedUsers([]);
      }
    } catch (error) {
      console.log("Error fetching project users:", error);
      setAddedUsers([]);
    }
  };

  const addUserToProject = async (userId: number, projectId: number) => {
    try {
      await assignUserProject({
        projectId: projectId,
        userId: userId,
      });

      // Refresh the project users list after successful assignment
      await getProjectUsers();
      
      // Remove the user from the available users list
      setListUser((prev) => prev.filter((user) => user.userId !== userId));
      
      toast.success("Thêm thành viên thành công!");
    } catch (error) {
      toast.error("Thêm thành viên thất bại!");
      console.log(error);
    }
  };

  const removeUserFromProjectHandler = async (
    userId: number,
    projectId: number
  ) => {
    try {
      await removeUserFromProject({
        projectId: projectId,
        userId: userId,
      });

      // Refresh the project users list after successful removal
      await getProjectUsers();
      
      // Add the user back to the available users list
      const userToRemove = addedUsers.find((user) => user.userId === userId);
      if (userToRemove) {
        setListUser((prev) => [...prev, userToRemove]);
      }
      
      toast.success("Xóa thành viên thành công!");
    } catch (error) {
      toast.error("Xóa thành viên thất bại!");
      console.log(error);
    }
  };

  // Lọc user theo tên đã chuẩn hóa
  const filteredUsers = listUsers.filter((user) =>
    normalizeVN(user.name).includes(normalizeVN(search))
  );

  return (
    <>
      <div className=" w-[240px] min-w-[150px] relative my-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Search..."
          />
          <button
            className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="users-left w-1/2">
          <h2>Chưa add users</h2>
          <List
            sx={{
              width: "100%",
              maxWidth: 500,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 },
            }}
          >
            <ul>
              {filteredUsers.map((item) => (
                <ListItem key={item.userId}>
                  <ListItemText
                    primary={item.name}
                    secondary={`User Id: ${item.userId}`}
                  />
                  <Button
                    variant="contained"
                    onClick={() => addUserToProject(item.userId, id)}
                  >
                    Add
                  </Button>
                </ListItem>
              ))}
            </ul>
          </List>
        </div>
        <div className="users-right w-1/2">
          <h2>Đã add users</h2>
          <List
            sx={{
              width: "100%",
              maxWidth: 500,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 },
            }}
          >
            <ul>
              {addedUsers.map((item) => (
                <ListItem key={item.userId} className="flex justify-between">
                  <ListItemText
                    primary={item.name}
                    secondary={`User ID:${item.userId}`}
                  />
                  <Button
                    onClick={() =>
                      removeUserFromProjectHandler(item.userId, id)
                    }
                    color="error"
                    variant="outlined"
                  >
                    Remove
                  </Button>
                </ListItem>
              ))}
            </ul>
          </List>
        </div>
      </div>
    </>
  );
}
