# API — Chỉ Số Giá Bán Lẻ

## Endpoint

```
GET /api/v1/dashboard/pricing
```

Query params: xem [Bộ lọc toàn cục](./01-dashboard-overview.md#query-params-bộ-lọc-toàn-cục--dùng-chung-cho-4-màn)

---

## Response Schema

```typescript
{
  internal_price_gap: AreaSkuPriceRow[]
  competitive: CompetitiveData
}
```

---

## Section 1 — Khoảng lệch giá nội bộ PINACO

### AreaSkuPriceRow

Mỗi row là **một cặp khu vực × SKU PINACO**.

```typescript
type PriceStatus = "normal" | "suspicious"
// FE map:
//   "normal"     → badge xanh "Bình thường"
//   "suspicious" → badge đỏ  "Nghi ngờ phá giá nội bộ"

type SkuBoxData = {
  sku_name: string         // "PTX5L" | "N50" | "N70" | "N200" | ...
  min: number              // Giá min trong toàn bộ mẫu (VNĐ)
  q1: number               // Tứ phân vị dưới
  median: number           // Trung vị
  q3: number               // Tứ phân vị trên
  max: number              // Giá max
  outlier?: number         // Điểm ngoại lai nếu có (VNĐ) — FE vẽ dấu chấm đỏ
}

type AreaSkuPriceRow = {
  area_name: string        // "Trảng Bàng" | "Gò Dầu" | ...  (store.area)
  sku_name: string         // "PTX5L" | "N50" | ...
  store_count: number      // Số cửa hàng ghi nhận SKU này trong khu vực
  price_min: number        // VNĐ
  price_mean: number       // VNĐ
  price_median: number     // VNĐ
  price_max: number        // VNĐ
  gap_pct: number          // % chênh giữa giá min và mean: (min - mean) / mean × 100 — thường âm
  status: PriceStatus      // BE phân loại theo ngưỡng
}
```

> **Logic `status` (BE tính):**
> - `suspicious`: `gap_pct` < −10% → "Nghi ngờ phá giá nội bộ"
> - `normal`: còn lại → "Bình thường"

**FE dùng để render:**
- Box plot chart (pure SVG): 1 box per SKU, trục Y là giá VNĐ
  - Box từ Q1 đến Q3, đường median, râu min/max, chấm đỏ cho outlier
- Bảng: `area_name`, `sku_name`, `store_count`, `price_min`, `price_mean`, `price_median`, `price_max`, `gap_pct`, `status`
- Alert panel xuất hiện khi có bất kỳ row nào `status = "suspicious"`

> **Lưu ý:** `box_data` (thống kê toàn tập mẫu theo SKU) và `table` (theo khu vực × SKU) cần BE trả riêng hoặc FE tổng hợp.

**Ví dụ (SkuBoxData):**
```json
[
  { "sku_name": "PTX5L", "min": 440000, "q1": 460000, "median": 505000, "q3": 540000, "max": 560000, "outlier": 280000 },
  { "sku_name": "N50",   "min": 1250000, "q1": 1290000, "median": 1315000, "q3": 1375000, "max": 1410000 },
  { "sku_name": "N70",   "min": 1680000, "q1": 1710000, "median": 1745000, "q3": 1800000, "max": 1840000 },
  { "sku_name": "N200",  "min": 3450000, "q1": 3700000, "median": 3870000, "q3": 4050000, "max": 4200000 }
]
```

**Ví dụ (AreaSkuPriceRow):**
```json
[
  { "area_name": "Trảng Bàng", "sku_name": "PTX5L", "store_count": 18, "price_min": 440000, "price_mean": 500000, "price_median": 505000, "price_max": 560000,  "gap_pct": -12.0, "status": "suspicious" },
  { "area_name": "Gò Dầu",     "sku_name": "N50",   "store_count": 14, "price_min": 1250000, "price_mean": 1320000, "price_median": 1315000, "price_max": 1410000, "gap_pct": -5.3,  "status": "normal"     },
  { "area_name": "Hòa Thành",  "sku_name": "N70",   "store_count": 21, "price_min": 1680000, "price_mean": 1750000, "price_median": 1745000, "price_max": 1840000, "gap_pct": -4.0,  "status": "normal"     },
  { "area_name": "Tân Biên",   "sku_name": "N200",  "store_count": 9,  "price_min": 3450000, "price_mean": 3900000, "price_median": 3920000, "price_max": 4200000, "gap_pct": -11.5, "status": "suspicious" }
]
```

**Nguồn dữ liệu:**
- Answer code `PRICE_CHECK`: `{ sku_key: { brand: price_vnd } }`
- Chỉ lấy các entry mà key brand = PINACO
- Nhóm theo `store.area` + `sku_key` → tính min/q1/median/q3/max

---

## Section 2 — Tương quan giá cạnh tranh

```typescript
type CompetitiveData = {
  stores: StoreCompetitiveData[]   // Danh sách cửa hàng có đủ dữ liệu so sánh
}

type StoreCompetitiveData = {
  store_id: string
  store_name: string

  groups: ProductGroupPrice[]      // Giá trung bình per nhóm sản phẩm × thương hiệu
  comparison: CompetitorRow[]      // Bảng so sánh PINACO vs từng đối thủ
  alert?: string                   // Text cảnh báo nếu có lệch biên độ lớn (BE tự tạo)
                                   // VD: "PINACO thấp hơn GS trên 15% tại 4 cửa hàng"
}

type ProductGroupPrice = {
  group_name: string               // "AGM 5Ah" | "MF 50Ah" | "CMF 70Ah" (nhóm SKU tương đương)
  prices: {
    [brand: string]: number        // Giá trung bình VNĐ: { "PINACO": 520000, "GS": 620000, ... }
  }
}

type CompetitorRow = {
  competitor: string               // "GS" | "Enimac" | ...
  store_count: number              // Số cửa hàng cùng bán PINACO và đối thủ này
  higher_pct: number               // % cửa hàng PINACO cao hơn đối thủ
  same_pct: number                 // % cửa hàng PINACO bằng (±3%)
  lower_pct: number                // % cửa hàng PINACO thấp hơn đối thủ
}
```

> **Logic `alert` (BE tính):**
> Đếm số cửa hàng mà `(pinaco_price - competitor_price) / competitor_price < -15%`
> Nếu đếm > 0 → trả `alert: "PINACO thấp hơn {brand} trên 15% tại {count} cửa hàng"`

**FE dùng để render:**
- 3 dropdown filter (FE-side): Cửa hàng, Nhóm sản phẩm tương đương, Thương hiệu đối thủ (multi-select)
- Grouped bar chart: trục X = product group, 1 bar per brand được chọn, label giá VNĐ trên đầu
- Bảng so sánh: Đối thủ × Số CH × PINACO cao hơn % (xanh) × PINACO bằng % (xám) × PINACO thấp hơn % (đỏ)
- Alert panel (đỏ) nếu có `alert`

**Ví dụ:**
```json
{
  "stores": [
    {
      "store_id": "store-001",
      "store_name": "Cửa hàng Hoàng Phát",
      "groups": [
        { "group_name": "AGM 5Ah",  "prices": { "PINACO": 520000, "GS": 620000, "Enimac": 560000 } },
        { "group_name": "MF 50Ah",  "prices": { "PINACO": 1380000, "GS": 1680000, "Enimac": 1450000 } },
        { "group_name": "CMF 70Ah", "prices": { "PINACO": 1950000, "GS": 2320000, "Enimac": 2020000 } }
      ],
      "comparison": [
        { "competitor": "GS",     "store_count": 36, "higher_pct": 42, "same_pct": 11, "lower_pct": 47 },
        { "competitor": "Enimac", "store_count": 28, "higher_pct": 54, "same_pct": 7,  "lower_pct": 39 }
      ],
      "alert": "PINACO thấp hơn GS trên 15% tại 4 cửa hàng"
    }
  ]
}
```

---

## Response đầy đủ

```json
{
  "internal_price_gap": {
    "box_data": [
      { "sku_name": "PTX5L", "min": 440000, "q1": 460000, "median": 505000, "q3": 540000, "max": 560000, "outlier": 280000 }
    ],
    "table": [
      { "area_name": "Trảng Bàng", "sku_name": "PTX5L", "store_count": 18, "price_min": 440000, "price_mean": 500000, "price_median": 505000, "price_max": 560000, "gap_pct": -12.0, "status": "suspicious" }
    ]
  },
  "competitive": {
    "stores": [
      {
        "store_id": "store-001",
        "store_name": "Cửa hàng Hoàng Phát",
        "groups": [
          { "group_name": "AGM 5Ah", "prices": { "PINACO": 520000, "GS": 620000 } }
        ],
        "comparison": [
          { "competitor": "GS", "store_count": 36, "higher_pct": 42, "same_pct": 11, "lower_pct": 47 }
        ],
        "alert": "PINACO thấp hơn GS trên 15% tại 4 cửa hàng"
      }
    ]
  }
}
```

---

## Ghi chú triển khai

| Điểm | Ghi chú |
|------|---------|
| Nguồn giá | Answer code `PRICE_CHECK`: `{ sku_key: { brand: price_vnd } }` |
| Nhóm SKU tương đương | BE map `sku_key` → `group_name` (VD: `XEMAY_AGM_5AH` → `"AGM 5Ah"`) — cần định nghĩa mapping |
| Nhận biết SKU PINACO | Brand key trong PRICE_CHECK chứa `"PINACO"` (case-insensitive) |
| Đơn vị giá | VNĐ nguyên (không chia nghìn) |
| Nhóm theo khu vực (Section 1) | `store.area` — cần backfill migration |
| Dedup | 1 submission / store (lấy mới nhất) |
| Submission hợp lệ | Loại trừ `DELETED`, `SUPERSEDED`, `CANCELLED` |
| Bỏ: price_index line chart, BrandPriceSummary | Không có trong UI — đã loại khỏi response |
