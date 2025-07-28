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
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAction = () => {
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [description, setDescription] = useState("");

  const params = useParams();
  console.log("params", params.id);

  const navigate = useNavigate();

  const handleUpdate = () => {};

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
        >
          <MenuItem value="software">Dự án phần mềm</MenuItem>
          <MenuItem value="design">Dự án thiết kế</MenuItem>
          <MenuItem value="marketing">Dự án marketing</MenuItem>
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
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateAction;
