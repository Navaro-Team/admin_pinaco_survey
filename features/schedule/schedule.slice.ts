import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { taskService } from "../task/task.service";
import { parseTask, parseTasks, Task } from "@/model/Task.model";

interface ScheduleState {
  tasks: Task[];
  task: Task | null;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filter: {
    q: string;
    assigneeId: string;
    deadline?: Date;
    status: string;
  };
  requestState: RequestState;
}

const initialState: ScheduleState = {
  tasks: [],
  task: null,
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
  filter: {
    q: "",
    assigneeId: "",
    deadline: undefined,
    status: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const getTasks = commonCreateAsyncThunk({ type: 'schedule/getTasks', action: taskService.getTasks });
export const getTaskById = commonCreateAsyncThunk({ type: 'schedule/getTaskById', action: taskService.getTaskById });
export const deleteTask = commonCreateAsyncThunk({ type: 'schedule/deleteTask', action: taskService.deleteTask });

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    changeTask: (state, action) => {
      state.task = action.payload;
    },
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: 20,
        hasMore: true,
      };
    },
    changeAssigneeId: (state, action) => {
      state.filter.assigneeId = action.payload;
    },
    changeSearch: (state, action) => {
      state.filter.q = action.payload;
    },
    changeDeadline: (state, action) => {
      state.filter.deadline = action.payload;
    },
    changeStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    clearScheduleState: (state) => {
      state.requestState = { status: 'idle', type: '' };
      state.tasks = [];
      state.pagination = initialState.pagination;
      state.filter = initialState.filter;
    },
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.tasks || payload?.data?.data || payload?.data;
        const tasksArray = Array.isArray(responseData) ? responseData : (responseData?.tasks || []);
        const newTasks = parseTasks(tasksArray);

        if (state.pagination.page === 1) {
          state.tasks = newTasks;
          state.pagination.hasMore = newTasks.length >= 20;
        } else {
          const existingIds = new Set(state.tasks.map(t => t._id));
          const uniqueNewTasks = newTasks.filter(t => !existingIds.has(t._id));
          state.tasks = [...state.tasks, ...uniqueNewTasks];

          state.pagination.hasMore = uniqueNewTasks.length >= 20;
        }

        state.requestState = { status: 'completed', type: 'getTasks', data: state.pagination.page === 1 };
      })
      .addCase(getTasks.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getTasks' };
      })
      .addCase(getTasks.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getTasks', error: payload?.message };
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.task = responseData ? parseTask(responseData) : null;
        state.requestState = { status: 'completed', type: 'getTaskById' };
      })
      .addCase(getTaskById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getTaskById' };
      })
      .addCase(getTaskById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getTaskById', error: payload?.message };
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.tasks = state.tasks.filter(t => t._id !== payload.data.id);
        state.requestState = { status: 'completed', type: 'deleteTask' };
      })
      .addCase(deleteTask.pending, (state) => {
        state.requestState = { status: 'loading', type: 'deleteTask' };
      })
      .addCase(deleteTask.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'deleteTask', error: payload?.message };
      })
  },
})

export const { changePage, changeLimit, resetPagination, changeSearch, changeAssigneeId, changeDeadline, changeStatus, clearScheduleState, clearFilter, changeTask } = scheduleSlice.actions;

export default scheduleSlice.reducer;