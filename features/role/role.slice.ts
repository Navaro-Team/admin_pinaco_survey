import { parseRoleModels, RoleModel } from "@/model/Role.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";
import { roleService } from "./role.service";

interface RoleState {
  roles: RoleModel[];
  role: RoleModel | null;
  requestState: RequestState;
}

const initialState: RoleState = {
  roles: [],
  role: null,
  requestState: { status: "idle", type: "" },
}

export const getRoles = commonCreateAsyncThunk({ type: "getRoles", action: roleService.getRoles });

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRoleState: (state) => {
      state.roles = [];
      state.role = null;
      state.requestState = { status: "idle", type: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.requestState = { status: "loading", type: "getRoles" };
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.roles = parseRoleModels(responseData);
        state.requestState = { status: "completed", type: "getRoles" };
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getRoles", error: action.error.message };
      })
  },
});

export const { setRoles, setRole } = roleSlice.actions;
export default roleSlice.reducer;