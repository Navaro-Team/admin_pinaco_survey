import { parseStore, parseStores, Store } from "@/model/Store.model";
import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";
import { storeService } from "../store/store.service";

interface SalesPointsState {
  stores: Store[];
  store: Store | null;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filter: {
    search: string;
    area: string;
  },
  requestState: RequestState;
}

const initialState: SalesPointsState = {
  stores: [],
  store: null,
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
  filter: {
    search: "",
    area: "",
  },
  requestState: { status: 'idle', type: '' },
}

export const getStores = commonCreateAsyncThunk({ type: 'salesPoints/getStores', action: storeService.getStores });
export const searchStores = commonCreateAsyncThunk({ type: 'salesPoints/searchStores', action: storeService.searchStores });
export const deleteStore = commonCreateAsyncThunk({ type: 'salesPoints/deleteStore', action: storeService.deleteStore });
export const getStoreById = commonCreateAsyncThunk({ type: 'salesPoints/getStoreById', action: storeService.getStoreById });
export const createStore = commonCreateAsyncThunk({ type: 'salesPoints/createStore', action: storeService.createStore });
export const updateStore = commonCreateAsyncThunk({ type: 'salesPoints/updateStore', action: storeService.updateStore });
export const importStores = commonCreateAsyncThunk({ type: 'salesPoints/importStores', action: storeService.importStores });

export const salesPointsSlice = createSlice({
  name: 'salesPoints',
  initialState,
  reducers: {
    changeSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    changeArea: (state, action) => {
      state.filter.area = action.payload;
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
        limit: 20,
        hasMore: true,
      };
    },
    clearSalesPointsState: (state) => {
      state.requestState = { status: 'idle', type: '' };
      state.store = null;
    },
    clearFilter: (state) => {
      state.filter.search = "";
      state.filter.area = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStores.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data?.data || payload?.data?.data || payload?.data;
        const storesArray = Array.isArray(responseData) ? responseData : [];
        const newStores = parseStores(storesArray);

        if (state.pagination.page === 1) {
          state.stores = newStores;
          state.pagination.hasMore = newStores.length >= state.pagination.limit;
        } else {
          state.stores = [...state.stores, ...newStores];
          // const existingIds = new Set(state.stores.map(s => s.id));
          // const uniqueNewStores = newStores.filter(s => !existingIds.has(s.id));
          // state.stores = [...state.stores, ...uniqueNewStores];
          state.pagination.hasMore = newStores.length >= state.pagination.limit;
        }

        state.requestState = { status: 'completed', type: 'getStores', data: state.pagination.page === 1 };
      })
      .addCase(getStores.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getStores' };
      })
      .addCase(getStores.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getStores', error: payload?.message };
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        const storeId = action.meta.arg;
        state.stores = state.stores.filter(s => s.id !== storeId);
        if (state.store?.id === storeId) {
          state.store = null;
        }
        state.requestState = { status: 'completed', type: 'deleteStore' };
      })
      .addCase(deleteStore.pending, (state) => {
        state.requestState = { status: 'loading', type: 'deleteStore' };
      })
      .addCase(deleteStore.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'deleteStore', error: payload?.message };
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.store = responseData ? parseStore(responseData) : null;
        state.requestState = { status: 'completed', type: 'getStoreById' };
      })
      .addCase(getStoreById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getStoreById' };
      })
      .addCase(getStoreById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getStoreById', error: payload?.message };
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.store = responseData ? parseStore(responseData) : null;
        state.requestState = { status: 'completed', type: 'updateStore' };
      })
      .addCase(updateStore.pending, (state) => {
        state.requestState = { status: 'loading', type: 'updateStore' };
      })
      .addCase(updateStore.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'updateStore', error: payload?.message };
      })
      .addCase(createStore.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.store = responseData ? parseStore(responseData) : null;
        state.requestState = { status: 'completed', type: 'createStore' };
      })
      .addCase(createStore.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createStore' };
      })
      .addCase(createStore.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createStore', error: payload?.message };
      })
      .addCase(importStores.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.requestState = { status: 'completed', type: 'importStores', data: responseData };
      })
      .addCase(importStores.pending, (state) => {
        state.requestState = { status: 'loading', type: 'importStores' };
      })
      .addCase(importStores.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'importStores', error: payload?.message };
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.stores = parseStores(responseData.data);
        state.requestState = { status: 'completed', type: 'searchStores' };
      })
      .addCase(searchStores.pending, (state) => {
        state.requestState = { status: 'loading', type: 'searchStores' };
      })
      .addCase(searchStores.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'searchStores', error: payload?.message };
      })
  },
})

export const { changeSearch, changeArea, clearSalesPointsState, clearFilter, changePage, changeLimit, resetPagination } = salesPointsSlice.actions;

export default salesPointsSlice.reducer;

