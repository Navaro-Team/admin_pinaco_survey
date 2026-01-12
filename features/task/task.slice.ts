import { parseTask, Task } from "@/model/Task.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";
import { taskService } from "./task.service";

interface TaskState {
  tasks: Task[];
  task: Task | null;
  requestState: RequestState;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  requestState: { status: 'idle', type: '' },
}

export const getTasks = commonCreateAsyncThunk({ type: "getTasks", action: taskService.getTasks });
export const getTaskById = commonCreateAsyncThunk({ type: "getTaskById", action: taskService.getTaskById });

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
  }
})

export const { setTasks, setTask, clearTaskState } = taskSlice.actions;
export default taskSlice.reducer;