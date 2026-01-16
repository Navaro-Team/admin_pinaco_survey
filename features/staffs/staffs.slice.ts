import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { staffsService } from "./staffs.service";
import { User, parseUser, parseUsers } from "@/model/User.model";
import { ACTION } from "@/lib/types";

interface StaffsState {
  staffs: User[];
  staff: User | null;
  action: ACTION;
  filter: {
    search: string;
    role: string;
    status: string;
  },
  requestState: RequestState;
}

const initialState: StaffsState = {
  staffs: [],
  staff: null,
  action: "INS",
  filter: {
    search: "",
    role: "",
    status: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const getUsers = commonCreateAsyncThunk({ type: 'staffs/getUsers', action: staffsService.getUsers });
export const searchUsers = commonCreateAsyncThunk({ type: 'staffs/searchUsers', action: staffsService.searchUsers });
export const getUserById = commonCreateAsyncThunk({ type: 'staffs/getUserById', action: staffsService.getUserById });
export const createUser = commonCreateAsyncThunk({ type: 'staffs/createUser', action: staffsService.createUser });
export const updateUser = commonCreateAsyncThunk({ type: 'staffs/updateUser', action: staffsService.updateUser });
export const deleteUser = commonCreateAsyncThunk({ type: 'staffs/deleteUser', action: staffsService.deleteUser });
export const importUsers = commonCreateAsyncThunk({ type: 'staffs/importUsers', action: staffsService.importUsers });

export const staffsSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    changeAction: (state, action) => {
      state.action = action.payload;
    },
    changeSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    changeRole: (state, action) => {
      state.filter.role = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    changeStaff: (state, action) => {
      state.staff = action.payload;
    },
    clearStaffsState: (state) => {
      state.staff = null;
      state.action = "INS";
      state.requestState = { status: 'idle', type: '' };
    },
    clearFilter: (state) => {
      state.filter.search = "";
      state.filter.role = "";
      state.filter.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        const usersArray = Array.isArray(responseData) ? responseData : [];
        state.staffs = usersArray.map(parseUser);
        state.requestState = { status: 'completed', type: 'getUsers' };
      })
      .addCase(getUsers.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getUsers' };
      })
      .addCase(getUsers.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getUsers', error: payload?.message };
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.staffs = parseUsers(data.data);
        state.requestState = { status: 'completed', type: 'searchUsers' };
      })
      .addCase(searchUsers.pending, (state) => {
        state.requestState = { status: 'loading', type: 'searchUsers' };
      })
      .addCase(searchUsers.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'searchUsers', error: payload?.message };
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.staff = responseData ? parseUser(responseData) : null;
        state.requestState = { status: 'completed', type: 'getUserById', data: responseData };
      })
      .addCase(getUserById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getUserById' };
      })
      .addCase(getUserById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.staff = null;
        state.requestState = { status: 'failed', type: 'getUserById', error: payload?.message };
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        if (responseData) {
          state.staffs.push(parseUser(responseData));
        }
        state.requestState = { status: 'completed', type: 'createUser', data: responseData };
      })
      .addCase(createUser.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createUser' };
      })
      .addCase(createUser.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createUser', error: payload?.message };
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        if (responseData) {
          state.staff = parseUser(responseData);
          const index = state.staffs.findIndex(s => s.id === responseData.id);
          if (index !== -1) {
            state.staffs[index] = parseUser(responseData);
          }
        }
        state.requestState = { status: 'completed', type: 'updateUser', data: responseData };
      })
      .addCase(updateUser.pending, (state) => {
        state.requestState = { status: 'loading', type: 'updateUser' };
      })
      .addCase(updateUser.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'updateUser', error: payload?.message };
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.staffs = state.staffs.filter(s => s.id !== userId);
        if (state.staff?.id === userId) {
          state.staff = null;
        }
        state.requestState = { status: 'completed', type: 'deleteUser' };
      })
      .addCase(deleteUser.pending, (state) => {
        state.requestState = { status: 'loading', type: 'deleteUser' };
      })
      .addCase(deleteUser.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'deleteUser', error: payload?.message };
      })
      .addCase(importUsers.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.requestState = { status: 'completed', type: 'importUsers', data: responseData };
      })
      .addCase(importUsers.pending, (state) => {
        state.requestState = { status: 'loading', type: 'importUsers' };
      })
      .addCase(importUsers.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'importUsers', error: payload?.message };
      });
  },
})

export const { changeAction, changeSearch, changeRole, changeStatus, changeStaff, clearStaffsState, clearFilter } = staffsSlice.actions;
export default staffsSlice.reducer;

