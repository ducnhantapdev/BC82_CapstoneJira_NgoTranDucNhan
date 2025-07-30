import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectDetailById,
  getCatogories,
  updateProject,
  type ProjectCategory,
} from "../../../../apis/projects";
import { toast, ToastContainer } from "react-toastify";

const UpdateAction = () => {
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<ProjectCategory[]>([]);

  const params = useParams();
  console.log("params", params.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      fetchProjectDetail(Number(params.id));
    }
    fetchCategories();
  }, [params.id]);

  const fetchProjectDetail = async (id: number) => {
    try {
      const detail = await getProjectDetailById(id);
      toast.success("Lấy thông tin project thành công!");

      setProjectName(detail?.projectName || "");
      setDescription(detail?.description || "");
      setProjectCategory(detail?.categoryId?.toString() || "");
    } catch (error) {
      console.log("error", error);
      toast.error("Không lấy được thông tin project!");
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getCatogories();
      setCategories(Array.isArray(cats) ? cats : cats.category);
    } catch (error) {
      console.log("error", error);
      toast.error("Không lấy được danh mục!");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      // Lấy id user hiện tại từ localStorage
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      await updateProject(id, {
        id: Number(params.id),
        projectName,
        description,
        categoryId: projectCategory,
        creator: user?.id,
      });
      toast.success("Cập nhật project thành công!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.log("error", error);
      toast.error("Cập nhật project thất bại!");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update project
      </Typography>

      <TextField
        label="Project ID"
        value={params.id}
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        required
        label="Project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Project category</InputLabel>
        <Select
          value={projectCategory}
          onChange={(e) => setProjectCategory(e.target.value)}
          label="Project category"
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.projectCategoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Description"
        multiline
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => handleUpdate(Number(params.id))}
        >
          Update
        </Button>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default UpdateAction;
