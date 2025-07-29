import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { getUserById, getUsersAPI, type User } from "../../../../../apis/users";
import { assignUserProject } from "../../../../../apis/projects";

interface projectIdParam {
  projectId: number;
}

export default function AddUsersToProject(projectId: projectIdParam) {
  const [listUsers, setListUser] = useState<User[]>([]);

  const id = projectId.projectId;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const listUser = await getUsersAPI();
      setListUser(listUser);
      console.log("listUser", listUser);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByIdd = async (id: number) => {
    try {
      const res = await getUserById(id);
      console.log(res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const addUserToProject = async (userId: number, projectId: number) => {
    try {
      await assignUserProject({
        projectId: projectId,
        userId: userId,
      });
      getUserByIdd(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
              {listUsers.map((item) => (
                <ListItem key={item.userId}>
                  <ListItemText primary={item.name} />
                  <Button onClick={() => addUserToProject(item.userId, id)}>
                    Add
                  </Button>
                </ListItem>
              ))}
            </ul>
          </List>
        </div>
        <div className="users-left">
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
              {/* {[0, 1, 2].map((item) => (
                    <ListItem key={`item-${sectionId}-${item}`}>
                      <ListItemText primary={`Item ${item}`} />
                      <Button>Add</Button>
                    </ListItem>
                  ))} */}
            </ul>
          </List>
        </div>
      </div>
    </>
  );
}
