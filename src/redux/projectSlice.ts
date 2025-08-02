import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getProjectsAPI, getProjectDetailById } from "../apis/projects";
import type { ProjectList, ProjectUpdate } from "../apis/projects";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const data = await getProjectsAPI();
    return data;
  }
);

export const fetchProjectDetail = createAsyncThunk(
  "projects/fetchProjectDetail",
  async (id: number) => {
    const data = await getProjectDetailById(id);
    return data;
  }
);

interface ProjectState {
  list: ProjectList[];
  currentProject: ProjectUpdate | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: ProjectState = {
  list: [],
  currentProject: null,
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
    clearCurrentProject: (state) => {
      state.currentProject = null;
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
      })
      .addCase(fetchProjectDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload || null;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      });
  },
});

export const { setSearchTerm, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
