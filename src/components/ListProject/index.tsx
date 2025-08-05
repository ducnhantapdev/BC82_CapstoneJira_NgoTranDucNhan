import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { fetchUsers } from "../../redux/userSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import CreateProjectModal from "../AppBar/menu/create-project-modal";
import { type ProjectList } from "../../apis/projects";
import { type User } from "../../apis/users";

import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ActionMenu from "./action";
import DeleteDialog from "./action/delete";
import UserActionMenu from "../UserActionMenu";
import EditUserForm from "../EditUserForm";
import DeleteUserDialog from "../DeleteUserDialog";

interface memberProps {
  userId: number;
  name: string;
  avatar: string;
}

export default function ListProjects() {
  const [deleteId, setDeleteId] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number>(0);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);

  const { list: allProjects, searchTerm: projectSearchTerm } = useSelector(
    (state: RootState) => state.projects
  );

  const { list: allUsers, searchTerm: userSearchTerm } = useSelector(
    (state: RootState) => state.users
  );

  const { currentView } = useSelector((state: RootState) => state.view);

  const filteredProjects = allProjects.filter((project) =>
    project.projectName.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const toProjectDetailUrl = (id: number) => {
    return `/project/${id}`;
  };

  useEffect(() => {
    if (currentView === "projects") {
      dispatch(fetchProjects());
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentView]);

  const onUpdate = (id: number) => {
    navigate(`/update-project/${id}`);
  };

  const onDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const onEditUser = (user: User) => {
    setEditUser(user);
    setOpenEditUser(true);
  };

  const onDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
    setOpenDeleteUser(true);
  };

  const projectColumns: GridColDef<ProjectList>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 250,
      editable: true,
      renderCell: (params) => (
        <Typography
          color="primary"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => navigate(toProjectDetailUrl(params.row.id))}
          className="pt-3"
        >
          {params.row.projectName}
        </Typography>
      ),
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      width: 150,
      editable: true,
    },
    {
      field: "creator",
      headerName: "Creator",
      width: 120,
      renderCell: (params) => {
        const creator = params.row.creator as { id: number; name: string };
        return creator && creator.name ? creator.name : "N/A";
      },
    },

    {
      field: "alias",
      headerName: "Alias",
      width: 250,
    },
    {
      field: "member",
      headerName: "Member",
      width: 200,
      renderCell: (params) => {
        const members = params.row.members as memberProps[];
        if (!members || members.length === 0) {
          return "N/A";
        }

        const remainingMembers = members.slice(2);
        const remainingNames = remainingMembers
          .map((member) => member.name)
          .join(", ");

        return (
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 10 },
            }}
          >
            {members.map((member, index) => (
              <Tooltip key={index} title={member.name} arrow>
                <Avatar
                  alt={member.avatar}
                  src={`${member.avatar}rounded=true&background=random`}
                  sx={{ width: 30, height: 30, fontSize: 16 }}
                />
              </Tooltip>
            ))}
            {remainingMembers.length > 0 && (
              <Tooltip title={remainingNames} arrow>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: 10,
                    backgroundColor: "#e0e0e0",
                    color: "#666",
                  }}
                >
                  +{remainingMembers.length}
                </Avatar>
              </Tooltip>
            )}
          </AvatarGroup>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <ActionMenu
          onUpdate={() => onUpdate(params.row.id)}
          onDelete={() => onDelete(params.row.id)}
        />
      ),
    },
  ];

  const userColumns: GridColDef<User>[] = [
    { field: "userId", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={params.row.avatar} sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" fontWeight={500}>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <UserActionMenu
          onEdit={() => onEditUser(params.row)}
          onDelete={() => onDeleteUser(params.row.userId)}
        />
      ),
    },
  ];

  return (
    <>
      <div>
        <div id="list-header" className="flex justify-between items-center ">
          <h1 className="font-bold text-2xl">
            {currentView === "projects" ? "Projects" : "Users"}
          </h1>
          {currentView === "projects" && <CreateProjectModal />}
        </div>
        <div id="list-content" className="mt-10">
          <Box sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={
                currentView === "projects" ? filteredProjects : filteredUsers
              }
              columns={
                currentView === "projects" ? projectColumns : userColumns
              }
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              getRowId={(row: any) =>
                currentView === "projects" ? row.id : row.userId
              }
            />
          </Box>
        </div>
      </div>
      {currentView === "projects" && (
        <DeleteDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          projectId={deleteId}
          onDelete={() => void dispatch(fetchProjects())}
        />
      )}

      <EditUserForm
        open={openEditUser}
        onClose={() => setOpenEditUser(false)}
        user={editUser}
        onSuccess={() => void dispatch(fetchUsers())}
      />

      <DeleteUserDialog
        open={openDeleteUser}
        onClose={() => setOpenDeleteUser(false)}
        user={allUsers.find((user) => user.userId === deleteUserId) || null}
        onDelete={() => void dispatch(fetchUsers())}
      />
    </>
  );
}
