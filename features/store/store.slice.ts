import { ACTION } from "@/lib/types";
import { parseStore, parseStores, Store } from "@/model/Store.model";
import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { storeService } from "./store.service";

interface StoreState {
  stores: Store[];
  store: Store | null;
  action: ACTION
  requestState: RequestState
}

const initialState: StoreState = {
  stores: [],
  store: null,
  action: 'VIE',
  requestState: { status: 'idle', type: '' },
}

export const getStores = commonCreateAsyncThunk({ type: 'store/getStores', action: storeService.getStores });
export const searchStores = commonCreateAsyncThunk({ type: 'store/searchStores', action: storeService.searchStores });
export const getStoreById = commonCreateAsyncThunk({ type: 'store/getStoreById', action: storeService.getStoreById });
export const createStore = commonCreateAsyncThunk({ type: 'store/createStore', action: storeService.createStore });
export const updateStore = commonCreateAsyncThunk({ type: 'store/updateStore', action: storeService.updateStore });
export const deleteStore = commonCreateAsyncThunk({ type: 'store/deleteStore', action: storeService.deleteStore });

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    changeAction: (state, action) => {
      state.action = action.payload;
    },
    changeStore: (state, action) => {
      state.store = action.payload;
    },
    clearStoreState: (state) => {
      state.store = null;
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStores.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data?.data || payload?.data?.data || payload?.data;
        state.stores = responseData ? parseStores(responseData) : [];
        state.requestState = { status: 'completed', type: 'getStores', data: action.payload };
      })
      .addCase(getStores.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getStores' };
      })
      .addCase(getStores.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getStores', error: action.error.message };
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.stores = parseStores(data.data);
        state.requestState = { status: 'completed', type: 'searchStores' };
      })
      .addCase(searchStores.pending, (state) => {
        state.requestState = { status: 'loading', type: 'searchStores' };
      })
      .addCase(searchStores.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'searchStores', error: payload?.message };
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.store = responseData ? parseStore(responseData) : null;
        console.log('state.store: ', state.store);
        state.requestState = { status: 'completed', type: 'getStoreById', data: action.payload };
      })
      .addCase(getStoreById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getStoreById' };
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.requestState = { status: 'failed', type: 'getStoreById', error: action.error.message };
      })
  },
});

export const { changeAction, changeStore, clearStoreState } = storeSlice.actions;
export default storeSlice.reducer;