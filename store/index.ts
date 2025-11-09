import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import { persistStore } from "redux-persist";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducers';
import { customMiddleware } from './middleware';

const persistConfig = {
	key: "admin-pinaco-survey",
	storage: storage,
	whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)
enableMapSet();
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false
		}).concat(customMiddleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

