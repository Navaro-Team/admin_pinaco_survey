import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isLogged: boolean
  requestState: RequestState;
}

const initialState: AppState = {
  isLogged: false,
  requestState: { status: 'idle', type: '' }
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    clearAppState: (state) => {
      state.requestState = { status: 'idle', type: '' }
    }
  },
  extraReducers: (builder) => { }
});

export const { setIsLogged } = appSlice.actions;
export default appSlice.reducer;