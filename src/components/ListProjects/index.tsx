import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { getProjectsAPI, type ProjectList } from "../../apis/projects";

interface memberProps {
  userId: number;
  name: string;
  avatar: string;
}

export default function ListProjects() {
  const [projects, setListProjects] = useState<ProjectList[]>([]);

  useEffect(() => {
    const fecthBanner = async () => {
      try {
        const getProjects = await getProjectsAPI();
        console.log("projects", getProjects);
        setListProjects(getProjects);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách projects:", error);
      }
    };
    fecthBanner();
  }, []);

  const columns: GridColDef<ProjectList>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 250,
      editable: true,
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
  ];

  console.log("Current projects state:", projects);

  return (
    <>
      <div>
        <div id="list-header" className="flex justify-between items-center ">
          <h1 className="font-bold text-2xl">Project</h1>
          <Button variant="contained" sx={{ color: "white" }}>
            Create Project
          </Button>
        </div>
        <div id="list-content" className="mt-10">
          <Box sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={projects}
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
    </>
  );
}
