import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";

interface ScheduleState {
  filter: {
    store: string;
    area: string;
    region: string;
    deadline: Date;
    status: string;
  }
  requestState: RequestState;
}

const initialState: ScheduleState = {
  filter: {
    store: "",
    area: "",
    region: "",
    deadline: new Date(),
    status: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    changeStore: (state, action) => {
      state.filter.store = action.payload;
    },
    changeArea: (state, action) => {
      state.filter.area = action.payload;
    },
    changeRegion: (state, action) => {
      state.filter.region = action.payload;
    },
    changeDeadline: (state, action) => {
      state.filter.deadline = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    clearScheduleState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    },
  },
})

export const { changeStore, changeArea, changeRegion, changeDeadline, changeStatus, clearScheduleState } = scheduleSlice.actions;

export default scheduleSlice.reducer;