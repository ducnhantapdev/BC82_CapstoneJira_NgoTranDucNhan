import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getUsersAPI, deleteUser } from "../apis/users";
import type { User } from "../apis/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const data = await getUsersAPI();
  return data;
});

export const deleteUserAction = createAsyncThunk(
  "users/deleteUser",
  async (userId: number) => {
    await deleteUser(userId);
    return userId;
  }
);

interface UserState {
  list: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
  searchTerm: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      })
      .addCase(deleteUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (user) => user.userId !== action.payload
        );
      })
      .addCase(deleteUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      });
  },
});

export const { setSearchTerm } = userSlice.actions;
export default userSlice.reducer;
