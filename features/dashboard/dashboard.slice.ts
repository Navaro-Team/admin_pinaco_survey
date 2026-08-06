import { RequestState } from "@/store/state";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "./dashboard.service";
import { AreaSkuPriceRow, DashboardOverviewData, DealerOutcome, DistributionData, PaginatedResponse, PricingData, StoreHealth, VolumeData } from "./dashboard.types";

interface DashboardState {
  areas: string[];
  dashboardOverview: DashboardOverviewData | null;
  dashboardVolume: VolumeData | null;
  dashboardPricing: PricingData | null;
  dashboardDistribution: DistributionData | null;
  businessOutcome: PaginatedResponse<DealerOutcome> | null;
  inventoryHealth: PaginatedResponse<StoreHealth> | null;
  pricingTable: PaginatedResponse<AreaSkuPriceRow> | null;
  requestState: RequestState;
}

const initialState: DashboardState = {
  areas: [],
  dashboardOverview: null,
  dashboardVolume: null,
  dashboardPricing: null,
  dashboardDistribution: null,
  businessOutcome: null,
  inventoryHealth: null,
  pricingTable: null,
  requestState: { status: "idle", type: "" },
}

export const getAreas = commonCreateAsyncThunk({ type: "getAreas", action: dashboardService.getAreas });
export const getDashboardOverview = commonCreateAsyncThunk({ type: "getDashboardOverview", action: dashboardService.getDashboardOverview });
export const getDashboardVolume = commonCreateAsyncThunk({ type: "getDashboardVolume", action: dashboardService.getDashboardVolume });
export const getDashboardPricing = commonCreateAsyncThunk({ type: "getDashboardPricing", action: dashboardService.getDashboardPricing });
export const getDashboardDistribution = commonCreateAsyncThunk({ type: "getDashboardDistribution", action: dashboardService.getDashboardDistribution });
export const getBusinessOutcome = commonCreateAsyncThunk({ type: "getBusinessOutcome", action: dashboardService.getBusinessOutcome });
export const getInventoryHealth = commonCreateAsyncThunk({ type: "getInventoryHealth", action: dashboardService.getInventoryHealth });
export const getPricingTable = commonCreateAsyncThunk({ type: "getPricingTable", action: dashboardService.getPricingTable });

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.requestState = { status: "idle", type: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAreas.pending, (state) => {
        state.requestState = { status: "loading", type: "getAreas" };
      })
      .addCase(getAreas.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.areas = payload.data?.data?.data?.areas ?? [];
        state.requestState = { status: "completed", type: "getAreas" };
      })
      .addCase(getAreas.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getAreas", error: action.error.message };
      })
      .addCase(getDashboardOverview.pending, (state) => {
        state.requestState = { status: "loading", type: "getDashboardOverview" };
      })
      .addCase(getDashboardOverview.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.dashboardOverview = payload.data?.data?.data;
        state.requestState = { status: "completed", type: "getDashboardOverview" };
      })
      .addCase(getDashboardOverview.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getDashboardOverview", error: action.error.message };
      })
      .addCase(getDashboardPricing.pending, (state) => {
        state.requestState = { status: "loading", type: "getDashboardPricing" };
      })
      .addCase(getDashboardPricing.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.dashboardPricing = payload.data?.data?.data ?? null;
        state.requestState = { status: "completed", type: "getDashboardPricing" };
      })
      .addCase(getDashboardPricing.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getDashboardPricing", error: action.error.message };
      })
      .addCase(getDashboardVolume.pending, (state) => {
        state.requestState = { status: "loading", type: "getDashboardVolume" };
      })
      .addCase(getDashboardVolume.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.dashboardVolume = payload.data?.data?.data ?? null;
        state.requestState = { status: "completed", type: "getDashboardVolume" };
      })
      .addCase(getDashboardVolume.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getDashboardVolume", error: action.error.message };
      })
      .addCase(getDashboardDistribution.pending, (state) => {
        state.requestState = { status: "loading", type: "getDashboardDistribution" };
      })
      .addCase(getDashboardDistribution.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.dashboardDistribution = payload.data?.data?.data ?? null;
        state.requestState = { status: "completed", type: "getDashboardDistribution" };
      })
      .addCase(getDashboardDistribution.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getDashboardDistribution", error: action.error.message };
      })
      .addCase(getBusinessOutcome.pending, (state) => {
        state.requestState = { status: "loading", type: "getBusinessOutcome" };
      })
      .addCase(getBusinessOutcome.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data: PaginatedResponse<DealerOutcome> = payload.data?.data?.data;
        if (!data) return;
        if (data.pagination.page === 1 || !state.businessOutcome) {
          state.businessOutcome = data;
        } else {
          state.businessOutcome = {
            ...data,
            rows: [...state.businessOutcome.rows, ...data.rows],
          };
        }
        state.requestState = { status: "completed", type: "getBusinessOutcome" };
      })
      .addCase(getBusinessOutcome.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getBusinessOutcome", error: action.error.message };
      })
      .addCase(getInventoryHealth.pending, (state) => {
        state.requestState = { status: "loading", type: "getInventoryHealth" };
      })
      .addCase(getInventoryHealth.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data: PaginatedResponse<StoreHealth> = payload.data?.data?.data;
        if (!data) return;
        if (data.pagination.page === 1 || !state.inventoryHealth) {
          state.inventoryHealth = data;
        } else {
          state.inventoryHealth = {
            ...data,
            rows: [...state.inventoryHealth.rows, ...data.rows],
          };
        }
        state.requestState = { status: "completed", type: "getInventoryHealth" };
      })
      .addCase(getInventoryHealth.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getInventoryHealth", error: action.error.message };
      })
      .addCase(getPricingTable.pending, (state) => {
        state.requestState = { status: "loading", type: "getPricingTable" };
      })
      .addCase(getPricingTable.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const data: PaginatedResponse<AreaSkuPriceRow> = payload.data?.data?.data;
        if (!data) return;
        if (data.pagination.page === 1 || !state.pricingTable) {
          state.pricingTable = data;
        } else {
          state.pricingTable = {
            ...data,
            rows: [...state.pricingTable.rows, ...data.rows],
          };
        }
        state.requestState = { status: "completed", type: "getPricingTable" };
      })
      .addCase(getPricingTable.rejected, (state, action) => {
        state.requestState = { status: "failed", type: "getPricingTable", error: action.error.message };
      })
  },
});

export const { } = dashboardSlice.actions;
export default dashboardSlice.reducer;
