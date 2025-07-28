import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjectsAPI } from "../apis/projects";
import type { ProjectList } from "../apis/projects";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const data = await getProjectsAPI();
    return data;
  }
);

interface ProjectState {
  list: ProjectList[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  list: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      });
  },
});

export default projectSlice.reducer;
