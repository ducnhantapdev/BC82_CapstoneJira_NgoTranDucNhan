import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { fetchUsers } from "../../redux/userSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import CreateProjectModal from "../AppBar/menu/create-project-modal";
import {
  type ProjectList,
  type ProjectMember,
  type ProjectCreator,
} from "../../apis/projects";
import { type User } from "../../apis/users";

import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ActionMenu from "./action";
import DeleteDialog from "./action/delete";
import UserActionMenu from "../UserActionMenu";
import EditUserForm from "../EditUserForm";
import DeleteUserDialog from "../DeleteUserDialog";
import { useMediaQuery } from "@mui/material";
import Pagination from "@mui/material/Pagination";

export default function ListProjects() {
  const [deleteId, setDeleteId] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number>(0);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [projectPage, setProjectPage] = useState<number>(1);
  const PROJECTS_PER_PAGE = 10;

  const {
    list: allProjects,
    searchTerm: projectSearchTerm,
    searchMode,
  } = useSelector((state: RootState) => state.projects);

  const { list: allUsers, searchTerm: userSearchTerm } = useSelector(
    (state: RootState) => state.users
  );

  const { currentView } = useSelector((state: RootState) => state.view);

  const filteredProjects = allProjects.filter((project) => {
    const term = projectSearchTerm.trim().toLowerCase();
    if (!term) return true;
    if (searchMode === "project") {
      return project.projectName.toLowerCase().includes(term);
    }

    const creatorName = (
      (project.creator as ProjectCreator | undefined)?.name || ""
    ).toLowerCase();
    const memberNames = ((project.members as ProjectMember[]) || [])
      .map((m: ProjectMember) => (m?.name || "").toLowerCase())
      .some((name: string) => name.includes(term));
    return creatorName.includes(term) || memberNames;
  });

  useEffect(() => {
    setProjectPage(1);
  }, [projectSearchTerm, searchMode, currentView]);

  const totalProjectPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  );
  const pagedProjects: ProjectList[] = isNaN(projectPage)
    ? filteredProjects.slice(0, PROJECTS_PER_PAGE)
    : filteredProjects.slice(
        (projectPage - 1) * PROJECTS_PER_PAGE,
        projectPage * PROJECTS_PER_PAGE
      );

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:430px)");

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
        const creator = params.row.creator as ProjectCreator;
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
        const members = params.row.members as ProjectMember[];
        if (!members || members.length === 0) {
          return "N/A";
        }

        const remainingMembers = members.slice(2);
        const remainingNames = remainingMembers
          .map((member: ProjectMember) => member.name)
          .join(", ");

        return (
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 10 },
            }}
          >
            {members.map((member: ProjectMember, index: number) => (
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
          {!isSmallScreen ? (
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={
                  currentView === "projects" ? filteredProjects : filteredUsers
                }
                columns={
                  currentView === "projects"
                    ? (projectColumns as unknown as GridColDef<
                        User | ProjectList
                      >[])
                    : (userColumns as unknown as GridColDef<
                        User | ProjectList
                      >[])
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
                getRowId={(row: ProjectList | User) =>
                  currentView === "projects"
                    ? (row as ProjectList).id
                    : (row as User).userId
                }
              />
            </Box>
          ) : (
            <div className="flex flex-col gap-3">
              {currentView === "projects"
                ? pagedProjects.map((p) => (
                    <div key={p.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start gap-2">
                        <button
                          onClick={() => navigate(toProjectDetailUrl(p.id))}
                          className="text-blue-600 font-semibold text-left"
                        >
                          {p.projectName}
                        </button>
                        <ActionMenu
                          onUpdate={() => onUpdate(p.id)}
                          onDelete={() => onDelete(p.id)}
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Category:</span>{" "}
                          {p.categoryName}
                        </div>
                        <div>
                          <span className="font-medium">Creator:</span>{" "}
                          {(p.creator as ProjectCreator)?.name || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Alias:</span> {p.alias}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium">Members:</span>
                          <AvatarGroup
                            max={3}
                            sx={{
                              "& .MuiAvatar-root": {
                                width: 24,
                                height: 24,
                                fontSize: 10,
                              },
                            }}
                          >
                            {((p.members as ProjectMember[]) || []).map(
                              (m: ProjectMember, idx: number) => (
                                <Avatar
                                  key={idx}
                                  alt={m?.name}
                                  src={`${m?.avatar}rounded=true&background=random`}
                                  sx={{ width: 28, height: 28 }}
                                />
                              )
                            )}
                          </AvatarGroup>
                        </div>
                      </div>
                    </div>
                  ))
                : filteredUsers.map((u) => (
                    <div key={u.userId} className="border rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} sx={{ width: 36, height: 36 }} />
                        <div className="flex-1">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-sm text-gray-600">{u.email}</div>
                          <div className="text-sm text-gray-600">
                            {u.phoneNumber}
                          </div>
                        </div>
                        <UserActionMenu
                          onEdit={() => onEditUser(u)}
                          onDelete={() => onDeleteUser(u.userId)}
                        />
                      </div>
                    </div>
                  ))}
              {currentView === "projects" && (
                <div className="flex justify-center py-2">
                  <Pagination
                    size="small"
                    count={totalProjectPages}
                    page={projectPage}
                    onChange={(_e, page) => setProjectPage(page)}
                    color="primary"
                  />
                </div>
              )}
            </div>
          )}
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
