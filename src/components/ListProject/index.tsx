import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import CreateProjectModal from "../AppBar/menu/create-project-modal";
import { type ProjectList } from "../../apis/projects";

import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ActionMenu from "./action";
import DeleteDialog from "./action/delete";

interface memberProps {
  userId: number;
  name: string;
  avatar: string;
}

export default function ListProjects() {
  const [deleteId, setDeleteId] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);

  const { list: allProjects, searchTerm } = useSelector(
    (state: RootState) => state.projects
  );

  const filteredProjects = allProjects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const toProjectDetailUrl = (id: number) => {
    return `/project/${id}`;
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onUpdate = (id: number) => {
    navigate(`/update-project/${id}`);
  };

  const onDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const columns: GridColDef<ProjectList>[] = [
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

  return (
    <>
      <div>
        <div id="list-header" className="flex justify-between items-center ">
          <h1 className="font-bold text-2xl">Project</h1>
          <CreateProjectModal />
        </div>
        <div id="list-content" className="mt-10">
          <Box sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={filteredProjects}
              columns={columns}
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
            />
          </Box>
        </div>
      </div>
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        projectId={deleteId}
        onDelete={() => void dispatch(fetchProjects())}
      />
    </>
  );
}
