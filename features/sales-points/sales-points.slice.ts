import { parseStores, Store } from "@/model/Store.model";
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
export const deleteStore = commonCreateAsyncThunk({ type: 'salesPoints/deleteStore', action: storeService.deleteStore });

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
          const existingIds = new Set(state.stores.map(s => s.id));
          const uniqueNewStores = newStores.filter(s => !existingIds.has(s.id));
          state.stores = [...state.stores, ...uniqueNewStores];

          state.pagination.hasMore = uniqueNewStores.length >= state.pagination.limit;
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
  },
})

export const { changeSearch, changeArea, clearSalesPointsState, clearFilter, changePage, changeLimit, resetPagination  } = salesPointsSlice.actions;

export default salesPointsSlice.reducer;

