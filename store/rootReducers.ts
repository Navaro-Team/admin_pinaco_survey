import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../features/app/app.slice';
import authReducer from '../features/auth/auth.slice';
import scheduleReducer from '../features/schedule/schedule.slice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  schedule: scheduleReducer,
});

export default rootReducer;