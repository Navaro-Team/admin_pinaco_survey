import { parseTask, parseTasks, Task } from "@/model/Task.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";
import { taskService } from "./task.service";
import { Store } from "@/model/Store.model";

interface TaskState {
  tasks: Task[];
  task: Task | null;
  stores: Store[];
  requestState: RequestState;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  stores: [],
  requestState: { status: 'idle', type: '' },
}

export const getTasks = commonCreateAsyncThunk({ type: "getTasks", action: taskService.getTasks });
export const getTaskById = commonCreateAsyncThunk({ type: "getTaskById", action: taskService.getTaskById });
export const getTaskBySubmissionAndSurvey = commonCreateAsyncThunk({ type: "getTaskBySubmissionAndSurvey", action: taskService.getTaskBySubmissionAndSurvey });
export const createTask = commonCreateAsyncThunk({ type: "createTask", action: taskService.createTask });
export const createTasks = commonCreateAsyncThunk({ type: "createTasks", action: taskService.createTasks });
export const createMultipleTasks = commonCreateAsyncThunk({ type: "createMultipleTasks", action: taskService.createMultipleTasks });
export const exportTasks = commonCreateAsyncThunk({ type: "exportTasks", action: taskService.exportTasks });
export const cancelTask = commonCreateAsyncThunk({ type: "cancelTask", action: taskService.cancelTask });

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setTask: (state, action) => {
      state.task = action.payload;
    },
    addStores: (state, action) => {
      const store = action.payload;
      const index = state.stores.findIndex(s => s.id === store.id);
      if (index >= 0) {
        state.stores[index] = store;
      } else {
        state.stores.push(store);
      }
    },
    removeStores: (state, action) => {
      const { id } = action.payload;
      state.stores = state.stores.filter(s => s.id !== id);
    },
    clearStores: (state) => {
      state.stores = [];
    },
    clearTaskState: (state) => {
      state.tasks = [];
      state.task = null;
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.tasks = responseData?.tasks || [];
      })
      .addCase(getTasks.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getTasks' };
      })
      .addCase(getTasks.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getTasks', error: payload?.message };
      })
      .addCase(getTaskById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getTaskById' };
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.task = responseData ? parseTask(responseData) : null;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getTaskById', error: payload?.message };
      })
      .addCase(getTaskBySubmissionAndSurvey.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getTaskBySubmissionAndSurvey' };
      })
      .addCase(getTaskBySubmissionAndSurvey.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.task = responseData ? parseTask(responseData) : null;
        state.requestState = { status: 'completed', type: 'getTaskBySubmissionAndSurvey' };
      })
      .addCase(getTaskBySubmissionAndSurvey.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getTaskBySubmissionAndSurvey', error: payload?.message };
      })
      .addCase(createMultipleTasks.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createMultipleTasks' };
      })
      .addCase(createMultipleTasks.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'completed', type: 'createMultipleTasks', data: payload };
      })
      .addCase(createMultipleTasks.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createMultipleTasks', error: payload?.message };
      })
      .addCase(createTask.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createTask' };
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.task = responseData ? parseTask(responseData) : null;
        state.requestState = { status: 'completed', type: 'createTask' };
      })
      .addCase(createTask.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createTask', error: payload?.message };
      })
      .addCase(exportTasks.pending, (state) => {
        state.requestState = { status: 'loading', type: 'exportTasks' };
      })
      .addCase(exportTasks.fulfilled, (state) => {
        state.requestState = { status: 'completed', type: 'exportTasks' };
      })
      .addCase(exportTasks.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'exportTasks', error: payload?.message };
      })
      .addCase(cancelTask.pending, (state) => {
        state.requestState = { status: "loading", type: "cancelTask" };
      })
      .addCase(cancelTask.fulfilled, (state) => {
        state.requestState = { status: "completed", type: "cancelTask" };
      })
      .addCase(cancelTask.rejected, (state) => {
        state.requestState = { status: "failed", type: "cancelTask" };
      })
      .addCase(createTasks.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createTasks' };
      })
      .addCase(createTasks.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        const newTasks = responseData ? parseTasks(responseData) : []
        state.tasks = [...state.tasks, ...newTasks];
        state.requestState = { status: 'completed', type: 'createTasks' };
      })
      .addCase(createTasks.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createTasks', error: payload?.message };
      })
  }
})

export const { setTasks, setTask, addStores, removeStores, clearStores, clearTaskState } = taskSlice.actions;
export default taskSlice.reducer;