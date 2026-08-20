# API — Dashboard Tổng Quan

## Endpoint

```
GET /api/dashboard/overview
```

---

## Query Params (Bộ lọc toàn cục — dùng chung cho 4 màn)

| Param           | Type     | Required | Mô tả                                                      |
|-----------------|----------|----------|------------------------------------------------------------|
| `region`        | `string` | No       | ID khu vực. Bỏ trống = tất cả khu vực                     |
| `staff`         | `string` | No       | ID nhân viên. Phụ thuộc `region`                           |
| `business_type` | `string` | No       | ID loại hình kinh doanh                                    |
| `categories`    | `string` | No       | Danh sách ID ngành hàng, phân cách bằng `,`               |
| `brand`         | `string` | No       | Brand key (lowercase) để tính KPI tổng quan. Mặc định: `pinaco`. VD: `gs`, `enimac`, `gs` |

> **Lưu ý:** Toàn bộ 4 màn đều dùng chung bộ query params này.

---

## Response Schema

```typescript
{
  kpis: KpiSummary
  group_by: 'region' | 'province'   // 'province' khi filter có region, 'region' khi xem toàn quốc
  sales: SalesDashboard
  inventory: InventoryDashboard
}
```

> **`group_by`**: khi `region` được chọn, các row trong bảng absolute/sow/share sẽ nhóm theo **tỉnh thành** (`store.province`) thay vì khu vực (`store.area`). FE dùng field này để đổi label cột header từ "Khu vực" → "Tỉnh thành".

---

### KpiSummary — Chỉ số tổng quan

```typescript
type KpiSummary = {
  valid_store_count: number           // Cửa hàng khảo sát hợp lệ (đã Q/C)
  focal_brand: string                 // Brand đang được tính KPI, VD: "pinaco", "gs"
  market_size_billion_vnd: number     // Quy mô thị trường tuyệt đối (tỷ VNĐ/tháng) — không đổi theo brand
  overall_sow_pct: number             // SOW của focal_brand (%)
  overall_inventory_share_pct: number // Inventory Share của focal_brand (%)
  overall_volume_share_pct: number    // Volume Share của focal_brand (%)
}
```

> **Nguồn SOW theo brand:**
> - `pinaco`: tử số lấy từ `SCALE_QUOTA_CHECK.amount` (câu hỏi chuyên biệt, đại lý tự khai)
> - Brand khác: tử số lấy từ tổng `VELOCITY_CHECK.values[brand].amount` — **nguồn khác nhau**, không so sánh trực tiếp với PINACO

**Ví dụ (focal_brand = "pinaco"):**
```json
{
  "valid_store_count": 1248,
  "focal_brand": "pinaco",
  "market_size_billion_vnd": 186.4,
  "overall_sow_pct": 34.8,
  "overall_inventory_share_pct": 31.2,
  "overall_volume_share_pct": 29.6
}
```

**Ví dụ (focal_brand = "gs"):**
```json
{
  "valid_store_count": 1248,
  "focal_brand": "gs",
  "market_size_billion_vnd": 186.4,
  "overall_sow_pct": 18.2,
  "overall_inventory_share_pct": 14.7,
  "overall_volume_share_pct": 11.3
}
```

---

### SalesDashboard — Doanh số bán ra

```typescript
type SalesDashboard = {
  absolute: RegionBrandRow[]                        // Section 1: Bức tranh doanh số tuyệt đối
  sow_by_region: RegionBrandPct[]                   // Section 2: SOW theo khu vực / tỉnh thành
  category_sow: Record<string, BrandPct[]>          // Section 3: Category SOW — trận địa cục bộ
  business_outcome: DealerOutcome[]                 // Section 4: Business outcome — trong overview response; có endpoint riêng hỗ trợ phân trang
}
```

> **`category_sow`** — key là category group (`"all"` | `"xe_may"` | `"xe_dien"` | `"xe_tai"` | ...), value là mảng `BrandPct[]` tổng = 100. FE dùng local combobox để switch category, không cần request thêm.
>
> **`business_outcome`** trong response overview chỉ chứa toàn bộ không phân trang. Để load có phân trang + filter segment, dùng endpoint riêng `GET /api/v1/dashboard/business-outcome` (xem bên dưới).

#### RegionBrandRow — Doanh số tuyệt đối theo khu vực / tỉnh thành

Đơn vị: **Triệu VNĐ / cửa hàng / tháng**

> `region_name` chứa **tên khu vực** khi `group_by = 'region'`, chứa **tên tỉnh thành** khi `group_by = 'province'`. FE đổi label cột header tương ứng.

```typescript
type StatEntry = {
  mean: number
  mode: number
  min: number
  max: number
}

type RegionBrandRow = {
  region_id: string
  region_name: string            // "Miền Nam" | "Miền Đông" | "Miền Tây"
  sample_count: number           // N
  total: StatEntry               // Tổng DS/cửa hàng
  brands: {
    pinaco:     StatEntry
    gs:         StatEntry
    enimac:     StatEntry
    globe:      StatEntry
    thien_nang: StatEntry
    yamato:     StatEntry
    xupai:      StatEntry
    cuu_hoi:    StatEntry
    khac:       StatEntry
  }
}
```

**FE mapping:** `mean` → hiển thị "Mean X", `mode` → "Mode X", `min`+`max` → "Min-Max X–Y"

**Ví dụ một row:**
```json
{
  "region_id": "mien-nam",
  "region_name": "Miền Nam",
  "sample_count": 1025,
  "total": { "mean": 312.4, "mode": 280.0, "min": 28, "max": 1850 },
  "brands": {
    "pinaco": { "mean": 106.2, "mode": 95.0, "min": 8, "max": 720 },
    "gs":     { "mean": 74.9,  "mode": 65.0, "min": 6, "max": 480 }
  }
}
```

---

#### RegionBrandPct — SOW theo khu vực

```typescript
type BrandPct = {
  brand: string   // "PINACO" | "GS" | "Enimac" | "Globe" | "Thiên Năng" | "Yamato" | "Xupai" | "Cứu Hội" | "Khác"
  pct: number     // 0–100, tổng tất cả brands trong 1 khu vực = 100
}

type RegionBrandPct = {
  region_id: string
  region_name: string     // "Miền Nam" | "Miền Đông" | "Miền Tây"
  brands: BrandPct[]      // mảng đã sắp xếp theo thứ tự hiển thị stacked bar
}
```

**Ví dụ:**
```json
{
  "region_id": "mien-nam",
  "region_name": "Miền Nam",
  "brands": [
    { "brand": "PINACO",     "pct": 37 },
    { "brand": "GS",         "pct": 14 },
    { "brand": "Enimac",     "pct": 10 },
    { "brand": "Globe",      "pct": 9  },
    { "brand": "Thiên Năng", "pct": 8  },
    { "brand": "Yamato",     "pct": 7  },
    { "brand": "Xupai",      "pct": 5  },
    { "brand": "Cứu Hội",   "pct": 4  },
    { "brand": "Khác",       "pct": 6  }
  ]
}
```

---

#### BrandPct — Category SOW (donut)

```typescript
type BrandPct = {
  brand: string
  pct: number
}
// Tổng tất cả pct = 100
```

> `category_sow` luôn được tính đầy đủ tất cả categories (không bị ảnh hưởng bởi global filter `categories`). FE switch client-side qua local combobox trong component.

---

#### DealerOutcome — Phân nhóm đại lý

```typescript
type DealerSegment = "loyal" | "potential" | "dominated"
// FE map: "loyal" → "Trung thành", "potential" → "Tiềm năng", "dominated" → "Bị chiếm lĩnh"

type DealerOutcome = {
  dealer_id: string
  dealer_name: string
  region: string                    // "Miền Nam" | "Miền Đông" | "Miền Tây"
  total_revenue_million: number     // Tổng DS/tháng (Triệu VNĐ)
  sow_pinaco_pct: number            // SOW PINACO (%)
  segment: DealerSegment            // BE tính toán phân nhóm
  main_competitor: string           // Tên thương hiệu đối thủ chính
  competitor_share_pct: number      // Tỷ lệ đối thủ chính (%)
}
```

> **Logic phân nhóm (BE tính từ SOW PINACO trong VELOCITY_CHECK):**
> - `loyal` (Trung thành): SOW PINACO > 60%
> - `potential` (Tiềm năng): 30% ≤ SOW ≤ 60%
> - `dominated` (Bị chiếm lĩnh): SOW < 30%

---

### Endpoint riêng cho Business Outcome (phân trang + filter segment)

```
GET /api/v1/dashboard/business-outcome
```

**Query params bổ sung:**

| Param     | Type                                    | Required | Mô tả                                          |
|-----------|-----------------------------------------|----------|------------------------------------------------|
| `segment` | `"loyal" \| "potential" \| "dominated"` | No       | Lọc theo phân nhóm đại lý. Bỏ trống = tất cả |
| `page`    | `number`                                | No       | Trang hiện tại (default: 1)                    |
| `limit`   | `number`                                | No       | Số row per page (default: 20)                  |

**Response:**

```typescript
type PaginatedResponse<T> = {
  group_by?: 'region' | 'province'
  rows: T[]
  pagination: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
}
// rows: DealerOutcome[]
```

---

### InventoryDashboard — Giá trị tồn kho

```typescript
type InventoryDashboard = {
  absolute: RegionInventoryRow[]          // Section 1: Bức tranh tồn kho tuyệt đối
  share_by_region: RegionBrandPct[]        // Section 2: Inventory share theo khu vực (cùng type với sales)
  category_share: CategoryInventoryShare  // Section 3: Category inventory share
  health: StoreHealth[]                   // Section 4: Inventory health
}
```

#### RegionInventoryRow — Tồn kho tuyệt đối

Đơn vị: **Triệu VNĐ / cửa hàng**

```typescript
type RegionInventoryRow = {
  region_id: string
  region_name: string
  sample_count: number
  total: StatEntry
  brands: {
    pinaco:     StatEntry
    gs:         StatEntry
    enimac:     StatEntry
    globe:      StatEntry
    thien_nang: StatEntry
    yamato:     StatEntry
    xupai:      StatEntry
    cuu_hoi:    StatEntry
    khac:       StatEntry
  }
}
// StatEntry giống hệt sales.absolute
```

---

#### CategoryInventoryShare — Category inventory (có filter ngành hàng riêng)

```typescript
type CategoryInventoryShare = Record<string, BrandPct[]>
// key: "all" | "xe_may" | "xe_dien" | "xe_tai" | ...
// value: mảng BrandPct[], tổng = 100
```

> BE trả toàn bộ categories cùng lúc (luôn tính đủ, không bị ảnh hưởng bởi global filter `categories`). FE dùng local combobox switch client-side — không cần request thêm. Cùng pattern với `category_sow`.

---

#### StoreHealth — Sức khoẻ kho hàng

```typescript
type AlertLevel = "danger" | "warning" | "info"

type StoreHealth = {
  store_id: string
  store_name: string
  region: string                  // khu vực hoặc tỉnh thành tuỳ group_by
  sow_pinaco_pct: number          // SOW PINACO (%) của cửa hàng này (từ VELOCITY_CHECK)
  inventory_share_pct: number     // Inventory Share PINACO (%) của cửa hàng này
  delta: number                   // inventory_share_pct - sow_pinaco_pct
  dominant_competitor: string     // Brand đối thủ chiếm inventory share cao nhất
  alert_level: AlertLevel
  alert_label: string             // BE trả label cụ thể, FE hiển thị
  suggested_action: string        // Hành động đề xuất
}
```

> **Logic cảnh báo (BE tính):**
> - `danger`: `sow_pinaco_pct` > 50% nhưng `inventory_share_pct` < 20% → rủi ro đứt hàng
> - `warning`: `inventory_share_pct` > 70% nhưng `sow_pinaco_pct` < 20% → rủi ro đọng vốn
> - `warning`: đối thủ dominant chiếm > 70% tồn kho
> - `info`: bình thường

**Endpoint riêng cho Inventory Health (phân trang):**

```
GET /api/v1/dashboard/inventory-health
```

| Param  | Type     | Required | Mô tả                        |
|--------|----------|----------|------------------------------|
| `page` | `number` | No       | Trang hiện tại (default: 1)  |
| `limit`| `number` | No       | Số row per page (default: 20)|

Response: `PaginatedResponse<StoreHealth>`

---

## Response đầy đủ

```json
{
  "kpis": {
    "valid_store_count": 1248,
    "market_size_billion_vnd": 186.4,
    "overall_sow_pct": 34.8,
    "overall_inventory_share_pct": 31.2,
    "overall_volume_share_pct": 29.6
  },
  "sales": {
    "absolute": [...],
    "sow_by_region": [...],
    "category_sow": [
      { "brand": "PINACO", "pct": 34 },
      { "brand": "GS",     "pct": 24 }
    ],
    "business_outcome": [
      {
        "dealer_id": "dl-001",
        "dealer_name": "Đại lý Minh Phát",
        "region": "Miền Nam",
        "total_revenue_million": 1250,
        "sow_pinaco_pct": 48,
        "segment": "loyal",
        "main_competitor": "GS",
        "competitor_share_pct": 27
      }
    ]
  },
  "inventory": {
    "absolute": [...],
    "share_by_region": [...],
    "category_share": {
      "all":    [{ "brand": "PINACO", "pct": 27 }, ...],
      "oto":    [{ "brand": "PINACO", "pct": 32 }, ...],
      "xe-may": [...],
      "xe-tai": [...]
    },
    "health": [
      {
        "store_id": "ch-001",
        "store_name": "Cửa hàng Hoàng Phát",
        "region": "Miền Nam",
        "sow_weeks": 2.1,
        "inventory_share_pct": 12,
        "alert_level": "danger",
        "alert_label": "Nguy cơ đứt hàng",
        "suggested_action": "ASM giục NPP giao hàng"
      }
    ]
  }
}
```
