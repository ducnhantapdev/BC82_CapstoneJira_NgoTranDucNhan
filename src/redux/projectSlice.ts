import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
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
  searchTerm: string;
}

const initialState: ProjectState = {
  list: [],
  loading: false,
  error: null,
  searchTerm: "",
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
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

export const { setSearchTerm } = projectSlice.actions;
export default projectSlice.reducer;
