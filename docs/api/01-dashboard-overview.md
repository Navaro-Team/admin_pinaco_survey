# API — Dashboard Tổng Quan

## Endpoint

```
GET /api/dashboard/overview
```

---

## Query Params (Bộ lọc toàn cục — dùng chung cho 4 màn)

| Param           | Type     | Required | Mô tả                                      |
|-----------------|----------|----------|--------------------------------------------|
| `region`        | `string` | No       | ID khu vực. Bỏ trống = tất cả khu vực     |
| `staff`         | `string` | No       | ID nhân viên. Phụ thuộc `region`           |
| `business_type` | `string` | No       | ID loại hình kinh doanh                    |
| `categories`    | `string` | No       | Danh sách ID ngành hàng, phân cách bằng `,` |

> **Lưu ý:** Toàn bộ 4 màn đều dùng chung bộ query params này. BE nên thiết kế filter middleware tái sử dụng.

---

## Response Schema

```typescript
{
  kpis: KpiSummary
  sales: SalesDashboard
  inventory: InventoryDashboard
}
```

---

### KpiSummary — Chỉ số tổng quan

```typescript
type KpiSummary = {
  valid_store_count: number          // Cửa hàng khảo sát hợp lệ (đã Q/C)
  market_size_billion_vnd: number    // Quy mô thị trường tuyệt đối (tỷ VNĐ/tháng)
  overall_sow_pct: number            // Overall SOW PINACO (%) — tỷ trọng doanh thu
  overall_inventory_share_pct: number // Overall Inventory Share PINACO (%) — tỷ trọng tồn kho
  overall_volume_share_pct: number   // Overall Volume Share PINACO (%) — mean sản lượng/10 bình
}
```

**Ví dụ:**
```json
{
  "valid_store_count": 1248,
  "market_size_billion_vnd": 186.4,
  "overall_sow_pct": 34.8,
  "overall_inventory_share_pct": 31.2,
  "overall_volume_share_pct": 29.6
}
```

---

### SalesDashboard — Doanh số bán ra

```typescript
type SalesDashboard = {
  absolute: RegionBrandRow[]        // Section 1: Bức tranh doanh số tuyệt đối
  sow_by_region: RegionBrandPct[]      // Section 2: SOW theo khu vực
  category_sow: BrandPct[]          // Section 3: Category SOW — trận địa cục bộ
  business_outcome: DealerOutcome[] // Section 4: Business outcome — phân nhóm đại lý
}
```

#### RegionBrandRow — Doanh số tuyệt đối theo khu vực

Đơn vị: **Triệu VNĐ / cửa hàng / tháng**

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

> **Lưu ý:** FE filter theo `categories` query param, BE trả về data đã filter sẵn.

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

> **Logic phân nhóm (BE tính):**
> - `loyal` (Trung thành): SOW PINACO ≥ 40%
> - `potential` (Tiềm năng): 20% ≤ SOW < 40%
> - `dominated` (Bị chiếm lĩnh): SOW < 20% hoặc đối thủ > 40%
>
> FE tự suy ra "Ưu tiên Sales" = dealer `dominated` có `total_revenue_million` cao nhất → không cần field riêng.

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
type CategoryInventoryShare = {
  [category_id: string]: BrandPct[]
  // key: "all" | "oto" | "xe-may" | "xe-tai" | ...
  // value: mảng BrandPct, tổng = 100
}
```

> **Lưu ý:** FE có combobox lọc ngành hàng **nội bộ trong section này** (không phải global filter). BE cần trả về data cho tất cả categories cùng lúc, FE tự switch client-side.
>
> Hoặc: tách thành endpoint riêng `GET /api/dashboard/overview/category-inventory?category=oto`

---

#### StoreHealth — Sức khoẻ kho hàng

```typescript
type AlertLevel = "danger" | "warning" | "info"
// FE map: "danger" → "Nguy cơ đứt hàng" (đỏ), "warning" → "Nguy cơ đọng vốn" (cam), "info" → "Đối thủ áp đảo" (xám)

type StoreHealth = {
  store_id: string
  store_name: string
  region: string                 // "Miền Nam" | "Miền Đông" | "Miền Tây"
  sow_weeks: number              // Số tuần tồn kho PINACO còn lại
  inventory_share_pct: number    // Inventory Share PINACO (%)
  alert_level: AlertLevel        // BE tính toán và phân loại
  alert_label: string            // BE trả về label cụ thể, FE chỉ hiển thị
  suggested_action: string       // Hành động đề xuất, BE định nghĩa theo rule
}
```

> **Logic cảnh báo (BE tính):**
> - `danger`: `sow_weeks` < 2.5 → đứt hàng sắp xảy ra
> - `warning`: `sow_weeks` > 6 hoặc `inventory_share_pct` > 30% → đọng vốn
> - `info`: đối thủ có share cao hơn PINACO

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
