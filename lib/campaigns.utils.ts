export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const CAMPAIGN_STATUS_LABELS = {
  DRAFT: 'Bản nháp',
  SCHEDULED: 'Đã lên lịch',
  ACTIVE: 'Đang diễn ra',
  ENDED: 'Đã kết thúc',
  ARCHIVED: 'Đã lưu trữ',
} as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS];
export type CampaignStatusLabel = (typeof CAMPAIGN_STATUS_LABELS)[keyof typeof CAMPAIGN_STATUS_LABELS];