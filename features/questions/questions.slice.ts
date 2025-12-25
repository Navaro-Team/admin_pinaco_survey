import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { questionsService, GetQuestionsParams } from "./questions.service";
import { Question, parseQuestion } from "@/model/Question.model";

interface QuestionsState {
  questions: Question[];
  total: number;
  selectedQuestion: Question | null;
  filter: {
    search: string;
    questionType: string;
  },
  requestState: RequestState;
}

const initialState: QuestionsState = {
  questions: [],
  total: 0,
  selectedQuestion: null,
  filter: {
    search: "",
    questionType: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const getQuestions: any = commonCreateAsyncThunk<GetQuestionsParams>({
  type: 'questions/getQuestions',
  action: questionsService.getQuestions
});

export const getQuestionById: any = commonCreateAsyncThunk<string>({
  type: 'questions/getQuestionById',
  action: questionsService.getQuestionById
});

export const updateQuestion: any = commonCreateAsyncThunk<{ id: string; data: any }>({
  type: 'questions/updateQuestion',
  action: async ({ id, data }) => questionsService.updateQuestion(id, data)
});

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    changeSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    changeQuestionType: (state, action) => {
      state.filter.questionType = action.payload;
    },
    clearFilter: (state) => {
      state.filter.search = "";
      state.filter.questionType = "";
    },
    clearQuestionsState: (state) => {
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.questions = responseData?.questions || [];
        state.total = responseData?.total || 0;
        state.requestState = { status: 'completed', type: 'getQuestions', data: responseData };
      })
      .addCase(getQuestions.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getQuestions' };
      })
      .addCase(getQuestions.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getQuestions', error: payload?.message };
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.selectedQuestion = responseData ? parseQuestion(responseData) : null;
        state.requestState = { status: 'completed', type: 'getQuestionById', data: responseData };
      })
      .addCase(getQuestionById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getQuestionById' };
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.selectedQuestion = null;
        state.requestState = { status: 'failed', type: 'getQuestionById', error: payload?.message };
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        if (responseData) {
          state.selectedQuestion = parseQuestion(responseData);
          // Update in questions list if exists
          const index = state.questions.findIndex(q => q._id === responseData._id);
          if (index !== -1) {
            state.questions[index] = parseQuestion(responseData);
          }
        }
        state.requestState = { status: 'completed', type: 'updateQuestion', data: responseData };
      })
      .addCase(updateQuestion.pending, (state) => {
        state.requestState = { status: 'loading', type: 'updateQuestion' };
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'updateQuestion', error: payload?.message };
      });
  },
})

export const { changeSearch, changeQuestionType, clearFilter, clearQuestionsState } = questionsSlice.actions;

export default questionsSlice.reducer;