import { parseSurvey, Survey } from "@/model/Survey.model";
import { RequestState } from "@/store/state";
import { surveyService } from "./survey.service";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";

interface SurveyState {
  survey: Survey | null;
  surveys: Survey[];
  requestState: RequestState;
}

const initialState: SurveyState = {
  survey: null,
  surveys: [],
  requestState: { status: 'idle', type: '' },
}

export const getSurveyById = commonCreateAsyncThunk({ type: "getSurveyById", action: surveyService.getSurveyById });
export const approveResurveyRequest = commonCreateAsyncThunk({ type: "approveResurveyRequest", action: surveyService.approveResurveyRequest });
export const rejectResurveyRequest = commonCreateAsyncThunk({ type: "rejectResurveyRequest", action: surveyService.rejectResurveyRequest });

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurvey: (state, action) => {
      state.survey = action.payload;
    },
    setSurveys: (state, action) => {
      state.surveys = action.payload;
    },
    clearSurveyState: (state) => {
      state.survey = null;
      state.surveys = [];
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurveyById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.survey = responseData ? parseSurvey(responseData) : null;
      })
      .addCase(getSurveyById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getSurveyById' };
      })
      .addCase(getSurveyById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getSurveyById', error: payload?.message };
      })
      .addCase(approveResurveyRequest.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'completed', type: 'approveResurveyRequest' };
      })
      .addCase(approveResurveyRequest.pending, (state) => {
        state.requestState = { status: 'loading', type: 'approveResurveyRequest' };
      })
      .addCase(approveResurveyRequest.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'approveResurveyRequest', error: payload?.message };
      })
      .addCase(rejectResurveyRequest.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'completed', type: 'rejectResurveyRequest' };
      })
      .addCase(rejectResurveyRequest.pending, (state) => {
        state.requestState = { status: 'loading', type: 'rejectResurveyRequest' };
      })
      .addCase(rejectResurveyRequest.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'rejectResurveyRequest', error: payload?.message };
      })
  },
})

export const { setSurvey, setSurveys, clearSurveyState } = surveySlice.actions;
export default surveySlice.reducer;