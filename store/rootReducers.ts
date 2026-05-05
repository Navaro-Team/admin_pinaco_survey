import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../features/app/app.slice';
import authReducer from '../features/auth/auth.slice';
import scheduleReducer from '../features/schedule/schedule.slice';
import questionsReducer from '../features/questions/questions.slice';
import staffsReducer from '../features/staffs/staffs.slice';
import salesPointsReducer from '../features/sales-points/sales-points.slice';
import storeReducer from '../features/store/store.slice';
import taskReducer from '../features/task/task.slice';
import surveyReducer from '../features/survey/survey.slice';
import submissionReducer from '../features/submission/submission.slice';
import { campaignsReducer } from '@/features/campaigns/campaigns.slice';
import roleReducer from '@/features/role/role.slice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  schedule: scheduleReducer,
  questions: questionsReducer,
  staffs: staffsReducer,
  salesPoints: salesPointsReducer,
  store: storeReducer,
  task: taskReducer,
  survey: surveyReducer,
  submission: submissionReducer,
  campaigns: campaignsReducer,
  role: roleReducer,
});

export default rootReducer;