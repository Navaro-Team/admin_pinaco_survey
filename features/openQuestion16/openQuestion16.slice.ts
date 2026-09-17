import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { openQuestion16Service } from "./openQuestion16.service";
import { OpenQuestion16FilterOptions, OpenQuestion16Report } from "./openQuestion16.types";

interface OpenQuestion16State {
  report: OpenQuestion16Report | null;
  filterOptions: OpenQuestion16FilterOptions;
  requestState: RequestState;
}

const initialState: OpenQuestion16State = {
  report: null,
  filterOptions: { provinces: [], storeGroups: [] },
  requestState: { status: "idle", type: "" },
};

export const getOpenQuestion16Report = commonCreateAsyncThunk({
  type: "getOpenQuestion16Report",
  action: openQuestion16Service.getReport,
});

export const getOpenQuestion16FilterOptions = commonCreateAsyncThunk({
  type: "getOpenQuestion16FilterOptions",
  action: openQuestion16Service.getFilterOptions,
});

export const openQuestion16Slice = createSlice({
  name: "openQuestion16",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOpenQuestion16Report.pending, (state) => {
        state.requestState = { status: "loading", type: "getOpenQuestion16Report" };
      })
      .addCase(getOpenQuestion16Report.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.report = payload?.data?.data?.data || payload?.data?.data || null;
        state.requestState = { status: "completed", type: "getOpenQuestion16Report" };
      })
      .addCase(getOpenQuestion16Report.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: "failed", type: "getOpenQuestion16Report", error: payload?.message };
      })
      .addCase(getOpenQuestion16FilterOptions.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data = payload?.data?.data?.data || payload?.data?.data;
        state.filterOptions = {
          provinces: Array.isArray(data?.provinces) ? data.provinces : [],
          storeGroups: Array.isArray(data?.storeGroups) ? data.storeGroups : [],
        };
      });
  },
});

export default openQuestion16Slice.reducer;
