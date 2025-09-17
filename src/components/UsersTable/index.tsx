import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUsersAPI, type User } from "../../apis/users";
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

// Loading component đẹp hơn
const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: 300,
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  gap: 16,
}));

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsersAPI();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns: GridColDef<User>[] = [
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
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress
          size={40}
          sx={{
            color: "#3b82f6",
            mb: 2,
          }}
        />
        <Typography variant="body1" color="#64748b" fontWeight={500}>
          Đang tải danh sách người dùng...
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <StyledDataGrid
        rows={users}
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
        getRowId={(row) => row.userId}
        sx={{
          height: 500,
          width: "100%",
        }}
        localeText={{
          noRowsLabel: "Không có dữ liệu người dùng",
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} hàng được chọn`
              : `${count.toLocaleString()} hàng được chọn`,
        }}
      />
    </Paper>
  );
}
