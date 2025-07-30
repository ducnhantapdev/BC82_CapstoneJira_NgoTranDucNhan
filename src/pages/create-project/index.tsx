import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Paper,
  TextareaAutosize,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  createProject,
  getCatogories,
  type ProjectCategory,
} from "../../apis/projects";
import { toast, ToastContainer } from "react-toastify";

import AddmemberModal from "./add-member";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  projectName: yup.string().required("Vui lòng nhập tên project"),
  category: yup.string().required("Vui lòng chọn danh mục"),
  description: yup.string().required("Vui lòng nhập mô tả"),
});

type FormValues = {
  projectName: string;
  category: string;
  description: string;
};

export default function CreateProject() {
  const [listCategories, setListCategories] = useState<ProjectCategory[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      projectName: "",
      category: "1",
      description: "",
    },
  });
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [projectId, setProjectId] = useState<number>(0);

  useEffect(() => {
    getCatogoriess();
  }, []);

  const getCatogoriess = async () => {
    try {
      const listCategory = await getCatogories();
      setListCategories(
        Array.isArray(listCategory) ? listCategory : listCategory.category
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await createProject({
        projectName: data.projectName,
        description: data.description,
        categoryId: data.category,
        creator: user?.id,
      });
      if (res?.id) {
        setProjectId(res.id);
        setIsAddMemberOpen(true);
      }
    } catch (error) {
      toast.error("Tạo project thất bại!");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" fontWeight={600}>
          New project
        </Typography>

        <Box mt={4} component={Paper} p={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3}>
              <Controller
                name="projectName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project name"
                    fullWidth
                    required
                    variant="outlined"
                    error={!!errors.projectName}
                    helperText={errors.projectName?.message}
                  />
                )}
              />
            </Box>

            <Box mb={3}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Project category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Project category"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {listCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.projectCategoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Descriptions
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    maxRows={4}
                    aria-label="maximum height"
                    placeholder="Maximum 4 rows"
                    style={{
                      width: "100%",
                      height: "100px",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              />
              {errors.description && (
                <FormHelperText error>
                  {errors.description.message}
                </FormHelperText>
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                type="button"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <AddmemberModal
        open={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        projectId={projectId}
      />
      <ToastContainer />
    </Container>
  );
}
