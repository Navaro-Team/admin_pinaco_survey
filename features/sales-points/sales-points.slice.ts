import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";

interface SalesPointsState {
  filter: {
    search: string;
    area: string;
  },
  requestState: RequestState;
}

const initialState: SalesPointsState = {
  filter: {
    search: "",
    area: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const salesPointsSlice = createSlice({
  name: 'salesPoints',
  initialState,
  reducers: {
    changeSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    changeArea: (state, action) => {
      state.filter.area = action.payload;
    },
    clearSalesPointsState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    },
  },
})

export const { changeSearch, changeArea, clearSalesPointsState } = salesPointsSlice.actions;

export default salesPointsSlice.reducer;

