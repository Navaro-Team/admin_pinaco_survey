import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";

interface StaffsState {
  filter: {
    search: string;
    role: string;
    status: string;
  },
  requestState: RequestState;
}

const initialState: StaffsState = {
  filter: {
    search: "",
    role: "",
    status: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const staffsSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    changeSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    changeRole: (state, action) => {
      state.filter.role = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    clearStaffsState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    },
  },
})

export const { changeSearch, changeRole, changeStatus, clearStaffsState } = staffsSlice.actions;

export default staffsSlice.reducer;

