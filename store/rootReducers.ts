import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../features/app/app.slice';
import authReducer from '../features/auth/auth.slice';
import scheduleReducer from '../features/schedule/schedule.slice';
import questionsReducer from '../features/questions/questions.slice';
import staffsReducer from '../features/staffs/staffs.slice';
import salesPointsReducer from '../features/sales-points/sales-points.slice';
import storeReducer from '../features/store/store.slice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  schedule: scheduleReducer,
  questions: questionsReducer,
  staffs: staffsReducer,
  salesPoints: salesPointsReducer,
  store: storeReducer,
});

export default rootReducer;