import { parseSubmission, parseSubmissions, Submission } from "@/model/Submission.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { submissionService } from "./submission.service";
import { createSlice } from "@reduxjs/toolkit";

interface SubmissionState {
  submission: Submission | null;
  submissions: Submission[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filter: {
    store: string;
    status: string;
  };
  requestState: RequestState;
}

const initialState: SubmissionState = {
  submission: null,
  submissions: [],
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
  filter: {
    store: "",
    status: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const getSubmissionById = commonCreateAsyncThunk({ type: "getSubmissionById", action: submissionService.getSubmissionById });
export const getPendingSubmissions = commonCreateAsyncThunk({ type: "getPendingSubmissions", action: submissionService.getPendingSubmissions });
export const reviewSubmission = commonCreateAsyncThunk({ type: "reviewSubmission", action: submissionService.reviewSubmission });

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
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: 20,
        hasMore: true,
      };
    },
    changeStore: (state, action) => {
      state.filter.store = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
    clearSubmissionState: (state) => {
      state.submission = null;
      state.submissions = [];
      state.pagination = initialState.pagination;
      state.filter = initialState.filter;
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubmissionById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.submission = responseData ? parseSubmission(responseData) : null;
        state.requestState = { status: 'completed', type: 'getSubmissionById' };
      })
      .addCase(getSubmissionById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getSubmissionById' };
      })
      .addCase(getSubmissionById.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getSubmissionById', error: action.error.message };
      })
      .addCase(getPendingSubmissions.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        const submissionsArray = Array.isArray(responseData)
          ? responseData
          : (responseData?.submissions || []);
        const newSubmissions = parseSubmissions(submissionsArray);

        if (state.pagination.page === 1) {
          state.submissions = newSubmissions;
          state.pagination.hasMore = newSubmissions.length >= state.pagination.limit;
        } else {
          const existingIds = new Set(state.submissions.map(s => s._id));
          const uniqueNewSubmissions = newSubmissions.filter(s => !existingIds.has(s._id));
          state.submissions = [...state.submissions, ...uniqueNewSubmissions];
          state.pagination.hasMore = uniqueNewSubmissions.length >= state.pagination.limit;
        }
        console.log('state.submissions: ', state.submissions);
        state.requestState = { status: 'completed', type: 'getPendingSubmissions', data: state.pagination.page === 1 };
      })
      .addCase(getPendingSubmissions.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getPendingSubmissions' };
      })
      .addCase(getPendingSubmissions.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getPendingSubmissions', error: action.error.message };
      })
      .addCase(reviewSubmission.fulfilled, (state) => {
        state.requestState = { status: 'completed', type: 'reviewSubmission' };
      })
      .addCase(reviewSubmission.pending, (state) => {
        state.requestState = { status: 'loading', type: 'reviewSubmission' };
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'reviewSubmission', error: action.error.message };
      });
  }
})

export const {
  setSubmission,
  setSubmissions,
  changePage,
  changeLimit,
  resetPagination,
  changeStore,
  changeStatus,
  clearFilter,
  clearSubmissionState
} = submissionSlice.actions;
export default submissionSlice.reducer;