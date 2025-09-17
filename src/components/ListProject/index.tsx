import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  AvatarGroup,
  Tooltip,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { fetchUsers } from "../../redux/userSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import CreateProjectModal from "../AppBar/menu/create-project-modal";
import { type ProjectList } from "../../apis/projects";
import { type User } from "../../apis/users";
import { useNavigate } from "react-router-dom";
import ActionMenu from "./action";
import DeleteDialog from "./action/delete";
import UserActionMenu from "../UserActionMenu";
import EditUserForm from "../EditUserForm";
import DeleteUserDialog from "../DeleteUserDialog";
import { styled } from "@mui/material/styles";

// Styled DataGrid với theme đẹp hơn
const StyledDataGrid = styled(DataGrid)(() => ({
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "& .MuiDataGrid-main": {
    borderRadius: "12px",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f8fafc",
    borderRadius: "12px 12px 0 0",
    borderBottom: "2px solid #e2e8f0",
    "& .MuiDataGrid-columnHeader": {
      fontWeight: 600,
      fontSize: "14px",
      color: "#475569",
      padding: "16px 12px",
      "&:focus": {
        outline: "none",
      },
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600,
    },
  },
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #f1f5f9",
    "&:hover": {
      backgroundColor: "#f8fafc",
      transition: "background-color 0.2s ease",
    },
    "&.Mui-selected": {
      backgroundColor: "#e0f2fe",
      "&:hover": {
        backgroundColor: "#b3e5fc",
      },
    },
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    padding: "12px",
    fontSize: "14px",
    color: "#334155",
    "&:focus": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: "0 0 12px 12px",
  },
  "& .MuiDataGrid-selectionColumnHeader": {
    backgroundColor: "#f8fafc",
  },
  "& .MuiDataGrid-checkboxInput": {
    color: "#3b82f6",
  },
}));

// Styled Avatar với border đẹp hơn
const StyledAvatar = styled(Avatar)(() => ({
  border: "2px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

// Styled AvatarGroup
const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  "& .MuiAvatar-root": {
    width: 28,
    height: 28,
    fontSize: 11,
    border: "2px solid #ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}));

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
    // searchMode === "user": match by creator or any member name
    const creatorName = (
      (project.creator as { id: number; name?: string } | undefined)?.name || ""
    ).toLowerCase();
    const memberNames = ((project.members as memberProps[]) || [])
      .map((m) => (m?.name || "").toLowerCase())
      .some((name: string) => name.includes(term));
    return creatorName.includes(term) || memberNames;
  });

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
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            fontWeight: 600,
            fontSize: "12px",
          }}
        />
      ),
    },
    {
      field: "projectName",
      headerName: "Tên dự án",
      width: 280,
      editable: true,
      renderCell: (params) => (
        <Box>
          <Typography
            color="primary"
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": {
                textDecoration: "underline",
                color: "#1976d2",
              },
            }}
            onClick={() => navigate(toProjectDetailUrl(params.row.id))}
          >
            {params.row.projectName}
          </Typography>
          <Typography variant="caption" color="#64748b">
            Nhấp để xem chi tiết
          </Typography>
        </Box>
      ),
    },
    {
      field: "categoryName",
      headerName: "Danh mục",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: "#f3e8ff",
            color: "#7c3aed",
            fontWeight: 500,
            fontSize: "12px",
          }}
        />
      ),
    },
    {
      field: "creator",
      headerName: "Người tạo",
      width: 150,
      renderCell: (params) => {
        const creator = params.row.creator as { id: number; name: string };
        return (
          <Typography variant="body2" color="#475569" fontWeight={500}>
            {creator && creator.name ? creator.name : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "alias",
      headerName: "Bí danh",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" color="#475569">
          {params.value || "Chưa có"}
        </Typography>
      ),
    },
    {
      field: "member",
      headerName: "Thành viên",
      width: 200,
      renderCell: (params) => {
        const members = params.row.members as memberProps[];
        if (!members || members.length === 0) {
          return (
            <Typography variant="body2" color="#94a3b8">
              Chưa có thành viên
            </Typography>
          );
        }

        return (
          <StyledAvatarGroup max={3}>
            {members.map((member, index) => (
              <Tooltip key={index} title={member.name} arrow>
                <StyledAvatar
                  alt={member.name}
                  src={`${member.avatar}rounded=true&background=random`}
                />
              </Tooltip>
            ))}
          </StyledAvatarGroup>
        );
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <ActionMenu
          onUpdate={() => onUpdate(params.row.id)}
          onDelete={() => onDelete(params.row.id)}
        />
      ),
    },
  ];

  const userColumns: GridColDef<User>[] = [
    {
      field: "userId",
      headerName: "ID",
      width: 90,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            fontWeight: 600,
            fontSize: "12px",
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Tên người dùng",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <StyledAvatar
            src={params.row.avatar}
            sx={{ width: 40, height: 40 }}
            alt={params.row.name}
          />
          <Box>
            <Typography variant="body2" fontWeight={600} color="#1e293b">
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Người dùng
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 280,
      renderCell: (params) => (
        <Typography variant="body2" color="#475569">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="#475569">
          {params.value || "Chưa cập nhật"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      headerAlign: "center",
      align: "center",
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
        <div
          id="list-header"
          className="flex justify-between items-center mb-8"
        >
          <h1 className="font-bold text-3xl text-gray-800">
            {currentView === "projects"
              ? "Danh sách dự án"
              : "Danh sách người dùng"}
          </h1>
          {currentView === "projects" && <CreateProjectModal />}
        </div>
        <div id="list-content">
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
          >
            <StyledDataGrid
              rows={
                currentView === "projects" ? filteredProjects : filteredUsers
              }
              columns={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (currentView === "projects"
                  ? projectColumns
                  : userColumns) as any
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
              getRowId={(row) =>
                currentView === "projects"
                  ? (row as ProjectList).id
                  : (row as User).userId
              }
              sx={{
                height: 600,
                width: "100%",
              }}
              localeText={{
                noRowsLabel:
                  currentView === "projects"
                    ? "Không có dữ liệu dự án"
                    : "Không có dữ liệu người dùng",
                footerRowSelected: (count) =>
                  count !== 1
                    ? `${count.toLocaleString()} hàng được chọn`
                    : `${count.toLocaleString()} hàng được chọn`,
              }}
            />
          </Paper>
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
