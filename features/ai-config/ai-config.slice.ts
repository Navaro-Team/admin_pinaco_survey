import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { aiConfigService } from "./ai-config.service";
import { AiClassificationConfig, parseAiClassificationConfig } from "@/model/AiClassificationConfig.model";

interface AiConfigState {
  config: AiClassificationConfig | null;
  requestState: RequestState;
}

const initialState: AiConfigState = {
  config: null,
  requestState: { status: 'idle', type: '' },
}

export const getAiConfig = commonCreateAsyncThunk({ type: 'aiConfig/getAiConfig', action: aiConfigService.getConfig });
export const updateAiConfig = commonCreateAsyncThunk({ type: 'aiConfig/updateAiConfig', action: aiConfigService.updateConfig });

export const aiConfigSlice = createSlice({
  name: 'aiConfig',
  initialState,
  reducers: {
    clearAiConfigState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAiConfig.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getAiConfig' };
      })
      .addCase(getAiConfig.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.config = responseData ? parseAiClassificationConfig(responseData) : null;
        state.requestState = { status: 'completed', type: 'getAiConfig' };
      })
      .addCase(getAiConfig.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getAiConfig', error: payload?.message };
      })
      .addCase(updateAiConfig.pending, (state) => {
        state.requestState = { status: 'loading', type: 'updateAiConfig' };
      })
      .addCase(updateAiConfig.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.config = responseData ? parseAiClassificationConfig(responseData) : state.config;
        state.requestState = { status: 'completed', type: 'updateAiConfig' };
      })
      .addCase(updateAiConfig.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'updateAiConfig', error: payload?.message };
      })
  },
})

export const { clearAiConfigState } = aiConfigSlice.actions;
export default aiConfigSlice.reducer;
