import { parseSubmission, Submission } from "@/model/Submission.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { submissionService } from "./submission.service";
import { createSlice } from "@reduxjs/toolkit";

interface SubmissionState {
  submission: Submission | null;
  submissions: Submission[];
  requestState: RequestState;
}

const initialState: SubmissionState = {
  submission: null,
  submissions: [],
  requestState: { status: 'idle', type: '' },
}

export const getSubmissionById = commonCreateAsyncThunk({ type: "getSubmissionById", action: submissionService.getSubmissionById });

export const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    setSubmission: (state, action) => {
      state.submission = action.payload;
    },
    setSubmissions: (state, action) => {
      state.submissions = action.payload;
    },
    clearSubmissionState: (state) => {
      state.submission = null;
      state.submissions = [];
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubmissionById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.submission = responseData ? parseSubmission(responseData) : null;
      })
      .addCase(getSubmissionById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getSubmissionById' };
      })
      .addCase(getSubmissionById.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getSubmissionById', error: action.error.message };
      })
  }
})

export const { setSubmission, setSubmissions, clearSubmissionState } = submissionSlice.actions;
export default submissionSlice.reducer;