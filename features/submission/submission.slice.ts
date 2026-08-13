import { parseSubmission, parseSubmissions, Submission } from "@/model/Submission.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { submissionService } from "./submission.service";
import { createSlice } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";

interface SubmissionState {
  submission: Submission | null;
  submissions: Submission[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number;
  };
  filter: {
    store: string;
    area: string;
    status: string;
    dateRange: DateRange;
  };
  requestState: RequestState;
}

const initialState: SubmissionState = {
  submission: null,
  submissions: [],
  pagination: {
    page: 1,
    limit: 10,
    hasMore: true,
    total: 0,
  },
  filter: {
    store: "",
    area: "",
    status: "",
    dateRange: { from: undefined, to: undefined }
  },
  requestState: { status: 'idle', type: '' },
}

export const getSubmissionById = commonCreateAsyncThunk({ type: "getSubmissionById", action: submissionService.getSubmissionById });
export const getPendingSubmissions = commonCreateAsyncThunk({ type: "getPendingSubmissions", action: submissionService.getPendingSubmissions });
export const reviewSubmission = commonCreateAsyncThunk({ type: "reviewSubmission", action: submissionService.reviewSubmission });
export const exportSubmission = commonCreateAsyncThunk({ type: "exportSubmission", action: submissionService.exportSubmission });

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
        limit: 10,
        hasMore: true,
        total: 0
      };
    },
    changeStore: (state, action) => {
      state.filter.store = action.payload;
    },
    changeArea: (state, action) => {
      state.filter.area = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    changeDateRange: (state, action) => {
      state.filter.dateRange = action.payload
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
        const paginationMeta = responseData?.pagination;
        const submissionsArray = Array.isArray(responseData)
          ? responseData
          : (responseData?.submissions || responseData?.data || []);
        state.submissions = parseSubmissions(submissionsArray);
        if (paginationMeta) {
          state.pagination.page = paginationMeta.page ?? state.pagination.page;
          state.pagination.limit = paginationMeta.limit ?? state.pagination.limit;
          state.pagination.total = paginationMeta.total ?? 0;
          state.pagination.hasMore = paginationMeta.hasMore ?? false;
        } else {
          state.pagination.total = responseData?.total ?? 0;
          state.pagination.hasMore = state.pagination.page < Math.ceil(state.pagination.total / state.pagination.limit);
        }
        state.requestState = { status: 'completed', type: 'getPendingSubmissions', data: state.pagination.page === 1 };
      })
      .addCase(getPendingSubmissions.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getPendingSubmissions' };
      })
      .addCase(getPendingSubmissions.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getPendingSubmissions', error: action.error.message };
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;

        if (!state.submission) return;
        state.submission = {
          ...state.submission,
          status: responseData.status,
        } as Submission;
        state.requestState = { status: 'completed', type: 'reviewSubmission', data: responseData.reviewAction };
      })
      .addCase(reviewSubmission.pending, (state) => {
        state.requestState = { status: 'loading', type: 'reviewSubmission' };
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'reviewSubmission', error: action.error.message };
      })
      .addCase(exportSubmission.fulfilled, (state) => {
        state.requestState = { status: 'completed', type: 'exportSubmission' };
      })
      .addCase(exportSubmission.pending, (state) => {
        state.requestState = { status: 'loading', type: 'exportSubmission' };
      })
      .addCase(exportSubmission.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'exportSubmission', error: action.error.message };
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
  changeArea,
  changeStatus,
  changeDateRange,
  clearFilter,
  clearSubmissionState
} = submissionSlice.actions;
export default submissionSlice.reducer;