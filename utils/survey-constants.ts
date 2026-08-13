export const BUSINESS_TYPES = [
  { code: "TYPE001", text: "Chuyên AQ oto" },
  { code: "TYPE002", text: "Gara oto" },
  { code: "TYPE003", text: "Phụ tùng xe máy" },
  { code: "TYPE004", text: "Sửa chữa xe máy" },
  { code: "TYPE005", text: "Chuyên e-bike" },
  { code: "TYPE006", text: "Chuyên ắc quy hỗn hợp" },
  { code: "TYPE007", text: "Hỗn hợp khác" },
] as const

export const PRODUCT_CATEGORIES = [
  { category: "GM_VRLA",       categoryGroup: "GM_VRLA",   categoryName: "GM" },
  { category: "GM_EBIKE",      categoryGroup: "GM_EBIKE",  categoryName: "E.bike" },
  { category: "OTO_MF",        categoryGroup: "OTO",       categoryName: "MF" },
  { category: "OTO_CMF_DL",    categoryGroup: "OTO",       categoryName: "CMF nhỏ" },
  { category: "OTO_CMF_TAI",   categoryGroup: "OTO",       categoryName: "CMF tải" },
  { category: "OTO_DANDUNG",   categoryGroup: "OTO",       categoryName: "Dân dụng" },
  { category: "OTO_NEW",       categoryGroup: "OTO",       categoryName: "EFB, AGM" },
  { category: "KHAC",          categoryGroup: "KHAC",      categoryName: "Ắc quy khác" },
] as const

export const BATTERY_TYPES = [
  { batteryTypeCode: "BATTERY_CAR",              batteryTypeName: "Chuyên ắc quy ô tô" },
  { batteryTypeCode: "BATTERY_GARA_OTO",         batteryTypeName: "Gara ô tô" },
  { batteryTypeCode: "BATTERY_MOTORCYCLE_PARTS", batteryTypeName: "Phụ tùng xe máy" },
  { batteryTypeCode: "BATTERY_REPAIR_MOTORCYCLE",batteryTypeName: "Sửa chữa xe máy" },
  { batteryTypeCode: "BATTERY_EBIKE",            batteryTypeName: "Chuyên e-bike" },
  { batteryTypeCode: "BATTERY_MIXED",            batteryTypeName: "Chuyên ắc quy hỗn hợp" },
  { batteryTypeCode: "BATTERY_OTHER",            batteryTypeName: "Hỗn hợp khác" },
] as const

export const BRANDS_CARRIED = [
  { brandCode: "PINACO",     brandName: "Pinaco / Đồng Nai" },
  { brandCode: "GS",         brandName: "GS" },
  { brandCode: "ENIMAC",     brandName: "Enimac" },
  { brandCode: "GLOBE",      brandName: "Globe" },
  { brandCode: "NGOAI_NHAP", brandName: "Ắc quy ngoại nhập" },
  { brandCode: "THIEN_NANG", brandName: "Thiên Năng" },
  { brandCode: "YAMATO",     brandName: "Yamato" },
  { brandCode: "XUPAI",      brandName: "Xupai" },
  { brandCode: "CUU_HOI",    brandName: "Cửu Hội (Passion)" },
  { brandCode: "OTHER",      brandName: "Nhãn hiệu khác" },
] as const

export const STORE_LEVELS = [
  { code: "L7", quote: "A", text: "Siêu lớn (>= 100.000.000vnd)" },
  { code: "L6", quote: "A", text: "Rất lớn (90.000.000 - < 100.000.000)" },
  { code: "L5", quote: "A", text: "Lớn (70.000.000 - < 90.000.000)" },
  { code: "L4", quote: "A", text: "Trung bình (50.000.000 - < 70.000.000)" },
  { code: "L3", quote: "A", text: "Dưới TB (40.000.000 - < 50.000.000)" },
  { code: "L2", quote: "B", text: "Nhỏ (30.000.000 - < 40.000.000)" },
  { code: "L1", quote: "B", text: "Rất nhỏ (< 30.000.000vnd)" },
] as const

/** Lookup category name by category key */
export const CATEGORY_NAME_MAP: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.category, c.categoryName])
)
