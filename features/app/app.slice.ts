import { User } from "@/model/User.model";
import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isLogged: boolean
  user: User | null;
  requestState: RequestState;
}

const initialState: AppState = {
  isLogged: false,
  user: null,
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
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => { }
});

export const { setIsLogged, setUser, clearUser } = appSlice.actions;
export default appSlice.reducer;