export interface Campaign {
  _id: string;
  campaignName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isDeleted: boolean;
  deletedAt: string | null;
  areas: string[];
}

export const parseCampaign = (campaign: any): Campaign => {
  return {
    _id: campaign._id,
    campaignName: campaign.campaignName,
    description: campaign.description,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    createdBy: campaign.createdBy,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    __v: campaign.__v,
    isDeleted: campaign.isDeleted,
    deletedAt: campaign.deletedAt,
    areas: campaign.areas,
  };
};

export const parseCampaigns = (campaigns: any[]): Campaign[] => {
  if (!Array.isArray(campaigns)) return [];
  return campaigns.map(parseCampaign);
};

export interface CampaignStatistics {
  totalTasks: number;
  completedTasks: number;
  totalStores: number;
  totalParticipants: number;
  completionRate: number;
}

export const parseCampaignStatistics = (campaignStatistics: any): CampaignStatistics => {
  return {
    totalTasks: campaignStatistics.totalTasks,
    completedTasks: campaignStatistics.completedTasks,
    totalStores: campaignStatistics.totalStores,
    totalParticipants: campaignStatistics.totalParticipants,
    completionRate: campaignStatistics.completionRate,
  };
};
