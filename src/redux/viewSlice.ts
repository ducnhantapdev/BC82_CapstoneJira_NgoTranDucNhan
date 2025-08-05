import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ViewType = "projects" | "users";

interface ViewState {
  currentView: ViewType;
}

const initialState: ViewState = {
  currentView: "projects",
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = viewSlice.actions;
export default viewSlice.reducer;
