import React from "react";
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
} from "@mui/material";

export default function CreateProject() {
  const [category, setCategory] = React.useState("");

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleCreate = () => {
    alert("Project created!");
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" fontWeight={600}>
          New project
        </Typography>

        <Box mt={4} component={Paper} p={4}>
          <Box mb={3}>
            <TextField
              label="Project name"
              fullWidth
              required
              variant="outlined"
            />
          </Box>

          <Box mb={3}>
            <FormControl fullWidth required>
              <InputLabel>Project category</InputLabel>
              <Select
                value={category}
                label="Project category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="development">Development</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Descriptions
            </Typography>
            <TextareaAutosize
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
