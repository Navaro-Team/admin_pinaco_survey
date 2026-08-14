export interface KpiSummary {
  valid_store_count: number
  focal_brand: string
  market_size_billion_vnd: number
  overall_sow_pct: number
  overall_inventory_share_pct: number
  overall_volume_share_pct: number
}

export interface StatEntry {
  mean: number
  mode: number
  min: number
  max: number
}

export interface BrandPct {
  brand: string
  pct: number
}

export interface RegionBrandRow {
  region_id: string
  region_name: string
  sample_count: number
  total: StatEntry
  brands: Record<string, StatEntry>
}

export interface RegionBrandPct {
  region_id: string
  region_name: string
  brands: BrandPct[]
}

export type DealerSegment = "loyal" | "potential" | "dominated"

export interface DealerOutcome {
  dealer_id: string
  dealer_name: string
  region: string
  total_revenue_million: number
  sow_pinaco_pct: number
  segment: DealerSegment
  main_competitor: string
  competitor_share_pct: number
}

export interface SalesData {
  absolute: RegionBrandRow[]
  sow_by_region: RegionBrandPct[]
  category_sow: Record<string, BrandPct[]>
  business_outcome: DealerOutcome[]
}

export type AlertLevel = "danger" | "warning" | "info"

export interface StoreHealth {
  store_id: string
  store_name: string
  region: string
  sow_pinaco_pct: number
  inventory_share_pct: number
  delta: number
  dominant_competitor: string
  alert_level: AlertLevel
  alert_label: string
  suggested_action: string
}

export interface InventoryData {
  absolute: RegionBrandRow[]
  share_by_region: RegionBrandPct[]
  category_share: Record<string, BrandPct[]>
  health: StoreHealth[]
}

export interface DashboardOverviewData {
  kpis: KpiSummary
  group_by: 'region' | 'province'
  sales: SalesData
  inventory: InventoryData
}

// ─── Volume ───────────────────────────────────────────────────────────────────

export type ZoneType = 'green' | 'yellow' | 'red'

export interface AreaVolumeRow {
  area_id: string
  area_name: string
  sample_count: number
  brands: Record<string, StatEntry>
}

export interface TerritoryRow {
  rank: number
  area_id: string
  area_name: string
  sample_count: number
  pinaco_mean: number
  zone: ZoneType
  main_competitor: string
}

export interface VolumeSummary {
  avg_pinaco_per_10: number
  avg_pinaco_pct: number
}

export interface VolumeData {
  summary: VolumeSummary
  absolute: AreaVolumeRow[]
  territory: TerritoryRow[]
}

// ─── Distribution ─────────────────────────────────────────────────────────────

export type RouteType = 'le' | 'hon_hop' | 'si'

export interface AreaChannelRow {
  area_id: string
  area_name: string
  sample_count: number
  retail_pct: number
  wholesale_pct: number
  dominant_route: RouteType
}

export interface AreaRouteSegment {
  area_id: string
  area_name: string
  total_count: number
  le_count: number
  le_pct: number
  hon_hop_count: number
  hon_hop_pct: number
  si_count: number
  si_pct: number
}

export interface DistributionData {
  channel_stats: AreaChannelRow[]
  route_segmentation: AreaRouteSegment[]
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export type PriceStatus = 'normal' | 'suspicious'

export interface SkuBoxData {
  sku_code: string
  sku_name: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outlier?: number
}

export interface AreaSkuPriceRow {
  area_name: string
  sku_code: string
  sku_name: string
  store_count: number
  price_min: number
  price_mean: number
  price_median: number
  price_max: number
  gap_pct: number
  status: PriceStatus
}

export interface StoreGroupPrice {
  store_id: string
  store_name: string
  groups: { sku_code: string; sku_name: string; prices: Record<string, number> }[]
}

export interface CompetitorRow {
  competitor: string
  store_count: number
  higher_pct: number
  same_pct: number
  lower_pct: number
}

export interface CompetitiveData {
  stores: StoreGroupPrice[]
  comparison: CompetitorRow[]
  alert?: string
}

export interface PricingData {
  internal_price_gap: { box_data: SkuBoxData[]; table: AreaSkuPriceRow[] }
  competitive: CompetitiveData
}

// ─── QC Dashboard ─────────────────────────────────────────────────────────────

export interface QCDashboardData {
  total_completed: number
  total_reviewed: number
  total_passed: number
  total_failed: number
  total_concluded: number
  location_mismatch_count: number
  review_rate_pct: number
  pass_rate_pct: number
  fail_rate_pct: number
}

// ─── Service Evaluation ───────────────────────────────────────────────────────

export interface ServiceKpiSummary {
  promotion_rating: number
  warranty_rating: number
  delivery_rating: number
  competitor_rating: number
}

export interface ServiceCriterionRow {
  code: string
  criteria_name: string
  sample_count: number
  min: number
  mean: number
  max: number
  mode: number
}

export interface ServiceEvalData {
  kpi_summary: ServiceKpiSummary
  satisfaction_by_criteria: Record<string, number>
  service_grid: ServiceCriterionRow[]
}

export interface PaginatedResponse<T> {
  group_by?: 'region' | 'province'
  rows: T[]
  pagination: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
}

export const BRAND_COLORS: Record<string, string> = {
  // lowercase keys — dùng cho sales / inventory charts
  pinaco:     "#1565C0",
  gs:         "#F97316",
  enimac:     "#4CAF50",
  globe:      "#9C27B0",
  thien_nang: "#FDD835",
  yamato:     "#FF7043",
  xupai:      "#42A5F5",
  cuu_hoi:    "#26C6DA",
  khac:       "#9E9E9E",
  // uppercase keys — dùng cho pricing (keys từ DB)
  PINACO:     "#1565C0",
  GS:         "#F97316",
  ENIMAC:     "#4CAF50",
  GLOBE:      "#9C27B0",
  THIEN_NANG: "#FDD835",
  YAMATO:     "#FF7043",
  XUPAI:      "#42A5F5",
  CUU_HOI:    "#26C6DA",
  NGOAI_NHAP: "#795548",
  OTHER:      "#78716c",
}

export const BRAND_KEYS = [
  "pinaco", "gs", "enimac", "globe", "thien_nang", "yamato", "xupai", "cuu_hoi", "khac",
]