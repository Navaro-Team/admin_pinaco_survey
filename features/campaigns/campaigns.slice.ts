import { RequestState } from "@/store/state";
import { createSlice } from "@reduxjs/toolkit";
import { Campaign, CampaignStatistics, parseCampaign, parseCampaigns, parseCampaignStatistics } from "@/model/Campaign.model";
import { commonCreateAsyncThunk } from "@/store/thunk";
import { campaignsService } from "./campaigns.service";
import { CAMPAIGN_STATUS, CampaignStatus } from "@/lib/campaigns.utils";

interface CampaignsState {
  campaigns: Campaign[];
  campaign: Campaign | null;
  campaignStatistics: CampaignStatistics | null;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filter: {
    search: string;
    status: typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS] | "";
  };
  requestState: RequestState;
}

const initialState: CampaignsState = {
  campaigns: [],
  campaign: null,
  campaignStatistics: null,
  pagination: {
    page: 1,
    limit: 50,
    hasMore: true,
  },
  filter: {
    search: "",
    status: "",
  },
  requestState: { status: 'idle', type: '' },
};

export const getCampaigns = commonCreateAsyncThunk({ type: 'getCampaigns', action: campaignsService.getCampaigns });
export const getCampaignStatistics = commonCreateAsyncThunk({ type: 'getCampaignStatistics', action: campaignsService.getCampaignStatistics });
export const getCampaignById = commonCreateAsyncThunk({ type: 'getCampaignById', action: campaignsService.getCampaignById });
export const createCampaign = commonCreateAsyncThunk({ type: 'createCampaign', action: campaignsService.createCampaign });
export const updateCampaign = commonCreateAsyncThunk({ type: 'updateCampaign', action: campaignsService.updateCampaign });
export const deleteCampaign = commonCreateAsyncThunk({ type: 'deleteCampaign', action: campaignsService.deleteCampaign });

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: 50,
        hasMore: true,
      };
    },
    changeCampaignFilterStatus: (state, action) => {
      state.filter.status = action.payload as typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS] | "";
    },
    changeCampaignFilterSearch: (state, action) => {
      state.filter.search = action.payload as string;
    },
    changeCampaign: (state, action) => {
      state.campaign = action.payload;
    },
    changeCampaignStatistics: (state, action) => {
      state.campaignStatistics = action.payload;
    },
    clearCampaignsState: (state) => {
      state.campaign = null;
      state.campaignStatistics = null;
      state.filter = {
        search: "",
        status: "",
      };
      state.pagination = initialState.pagination;
      state.requestState = { status: 'idle', type: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCampaigns.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.campaigns = parseCampaigns(responseData?.campaigns || []);
        state.pagination.page = Number(responseData?.page) || 1;
        state.pagination.limit = Number(responseData?.limit) || 50;
        state.pagination.hasMore = Number(responseData?.page) !== Number(responseData?.totalPages);
        state.requestState = { status: 'completed', type: 'getCampaigns' };
      })
      .addCase(getCampaigns.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getCampaigns' };
      })
      .addCase(getCampaigns.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getCampaigns', error: payload?.message };
      })
      .addCase(getCampaignStatistics.fulfilled, (state, action) => {
        const payload = action.payload as any;
        const responseData = payload?.data?.data?.data || payload?.data?.data || payload?.data;
        state.campaignStatistics = parseCampaignStatistics(responseData);
        state.requestState = { status: 'completed', type: 'getCampaignStatistics' };
      })
      .addCase(getCampaignStatistics.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getCampaignStatistics' };
      })
      .addCase(getCampaignStatistics.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getCampaignStatistics', error: payload?.message };
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.campaign = parseCampaign(payload?.data?.data?.data || payload?.data?.data || payload?.data);
        state.requestState = { status: 'completed', type: 'getCampaignById' };
      })
      .addCase(getCampaignById.pending, (state) => {
        state.requestState = { status: 'loading', type: 'getCampaignById' };
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'getCampaignById', error: payload?.message };
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.campaign = parseCampaign(payload?.data?.data?.data || payload?.data?.data || payload?.data);
        state.requestState = { status: 'completed', type: 'createCampaign' };
      })
      .addCase(createCampaign.pending, (state) => {
        state.requestState = { status: 'loading', type: 'createCampaign' };
      })
      .addCase(createCampaign.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'createCampaign', error: payload?.message };
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.campaign = parseCampaign(payload?.data?.data?.data || payload?.data?.data || payload?.data);
        state.requestState = { status: 'completed', type: 'updateCampaign' };
      })
      .addCase(updateCampaign.pending, (state) => {
        state.requestState = { status: 'loading', type: 'updateCampaign' };
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'updateCampaign', error: payload?.message };
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'completed', type: 'deleteCampaign' };
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.requestState = { status: 'loading', type: 'deleteCampaign' };
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        const payload = action.payload as any;
        state.requestState = { status: 'failed', type: 'deleteCampaign', error: payload?.message };
      })
  },
});

export const { changeCampaign, changeCampaignStatistics, clearCampaignsState, changeCampaignFilterStatus, changeCampaignFilterSearch, changePage, changeLimit, resetPagination } = campaignsSlice.actions;
export const campaignsReducer = campaignsSlice.reducer;