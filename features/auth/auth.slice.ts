import { createSlice } from '@reduxjs/toolkit';
import { authService } from './auth.service';
import { RequestState } from '@/store/state';
import { commonCreateAsyncThunk } from '@/store/thunk';

interface AuthState {
  requestState: RequestState;
}

const initialState: AuthState = {
  requestState: { status: 'idle', type: '' }
};

export const login: any = commonCreateAsyncThunk({ type: 'login', action: authService.login });
export const logout: any = commonCreateAsyncThunk({ type: 'logout', action: authService.logout });

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearRequestState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.requestState = { status: 'completed', type: 'login' };
      })
      .addCase(logout.fulfilled, (state) => {
        state.requestState = { status: 'completed', type: 'logout' };
      });
  }
});

export const {
  clearRequestState
} = authSlice.actions;

export default authSlice.reducer;