# API — Thị Phần Sản Lượng

## Endpoint

```
GET /api/v1/dashboard/volume
```

Query params: xem [Bộ lọc toàn cục](./01-dashboard-overview.md#query-params-bộ-lọc-toàn-cục--dùng-chung-cho-4-màn)

---

## Response Schema

```typescript
{
  summary: VolumeSummary
  absolute: AreaVolumeRow[]
  territory: TerritoryRow[]
}
```

---

## Summary KPI

```typescript
type VolumeSummary = {
  avg_pinaco_per_10: number    // Thị phần sản lượng PINACO trung bình trên hệ 10 bình (VD: 4.8)
  avg_pinaco_pct: number       // Quy đổi ra % (VD: 48)
}
```

**FE hiển thị:** góc trên phải của Section 2 — "4,8/10 bình · 48%"

---

## Section 1 — Bức tranh sản lượng tuyệt đối (hệ quy chiếu 10 bình)

### AreaVolumeRow

Đơn vị: **bình / cửa hàng / tháng, quy chiếu trên tổng 10 bình**

```typescript
type StatEntry = {
  mean: number    // VD: 7.2  (hiển thị "Mean: 7,2/10")
  mode: number    // VD: 8    (hiển thị "Mode: 8")
  min: number     // VD: 3    (hiển thị "Min–Max: 3–10")
  max: number     // VD: 10
}

type AreaVolumeRow = {
  area_id: string
  area_name: string        // "Trảng Bàng" | "Gò Dầu" | ...  (từ store.area)
  sample_count: number     // N
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

> Không có cột "Tổng" — FE hiển thị từng brand riêng.

**Cách tính (BE):**
- Mỗi submission có answer `VELOCITY_CHECK`: `{ totalAmount, values: [{ brandCode, brandName, amount }] }`
- Quy chiếu: `brand_per_10 = (brand_amount / totalAmount) × 10`
- Tính Mean, Mode, Min, Max của `brand_per_10` theo khu vực (`store.area`)

**FE dùng để render:** bảng cuộn ngang, mỗi ô = 3 dòng (Mean X/10 · Mode Y · Min–Max A–B)

**Ví dụ:**
```json
[
  {
    "area_id": "trang-bang",
    "area_name": "Trảng Bàng",
    "sample_count": 45,
    "brands": {
      "pinaco":     { "mean": 7.2, "mode": 8, "min": 3, "max": 10 },
      "gs":         { "mean": 1.5, "mode": 1, "min": 0, "max": 4  },
      "enimac":     { "mean": 0.5, "mode": 0, "min": 0, "max": 2  },
      "globe":      { "mean": 0.3, "mode": 0, "min": 0, "max": 2  },
      "thien_nang": { "mean": 0.2, "mode": 0, "min": 0, "max": 2  },
      "yamato":     { "mean": 0.1, "mode": 0, "min": 0, "max": 1  },
      "xupai":      { "mean": 0.0, "mode": 0, "min": 0, "max": 1  },
      "cuu_hoi":    { "mean": 0.0, "mode": 0, "min": 0, "max": 1  },
      "khac":       { "mean": 0.2, "mode": 0, "min": 0, "max": 2  }
    }
  }
]
```

---

## Section 2 — Định vị lãnh thổ — Territory Mapping

### TerritoryRow

```typescript
type Zone = "green" | "yellow" | "red"
// FE map:
//   "green"  → badge xanh,  text "Vùng Xanh — Thống lĩnh"  (pinaco_mean ≥ 6)
//   "yellow" → badge cam,   text "Vùng Vàng — Cạnh tranh"  (4 ≤ pinaco_mean < 6)
//   "red"    → badge đỏ,    text "Vùng Đỏ — Báo động"      (pinaco_mean < 4)

type TerritoryRow = {
  rank: number               // Xếp hạng (sort theo pinaco_mean DESC)
  area_id: string
  area_name: string
  sample_count: number
  pinaco_mean: number        // Mean PINACO /10 bình — dùng làm badge + phân loại
  zone: Zone
  main_competitor: string    // Text tự do: "GS — 1,5/10" hoặc "Yamato & Thiên Năng — 5,5/10"
                             // BE ghép: brand có mean cao nhất (không phải PINACO)
                             // Nếu 2 brand xấp xỉ nhau (delta ≤ 0.5) thì ghép "A & B — X/10"
}
```

> **Logic phân loại zone (BE tính từ `pinaco_mean`):**
> - `green`: `pinaco_mean` ≥ 6
> - `yellow`: 4 ≤ `pinaco_mean` < 6
> - `red`: `pinaco_mean` < 4

> **Logic `main_competitor`:**
> Lấy brand có `mean` cao nhất trong `brands` (trừ pinaco).
> Nếu brand #1 và #2 có `mean` chênh ≤ 0.5 → ghép "Brand1 & Brand2 — X/10" (X = mean trung bình 2 brand)

**FE dùng để render:**
- Bảng 6 cột: Xếp hạng · Khu vực · Số mẫu (N) · PINACO (/10 bình) badge màu · Phân loại lãnh thổ · Đối thủ chính
- Header góc phải: KPI `summary.avg_pinaco_per_10` và `summary.avg_pinaco_pct`
- Legend 3 vùng màu (FE render cứng)

**Ví dụ:**
```json
[
  { "rank": 1, "area_id": "trang-bang",      "area_name": "Trảng Bàng",      "sample_count": 45, "pinaco_mean": 7.2, "zone": "green",  "main_competitor": "GS — 1,5/10"                  },
  { "rank": 2, "area_id": "duong-minh-chau", "area_name": "Dương Minh Châu", "sample_count": 28, "pinaco_mean": 6.0, "zone": "green",  "main_competitor": "GS — 2,5/10"                  },
  { "rank": 3, "area_id": "hoa-thanh",       "area_name": "Hòa Thành",       "sample_count": 50, "pinaco_mean": 4.5, "zone": "yellow", "main_competitor": "Enimac — 3,5/10"              },
  { "rank": 4, "area_id": "go-dau",          "area_name": "Gò Dầu",          "sample_count": 32, "pinaco_mean": 2.5, "zone": "red",    "main_competitor": "GS — 6,0/10"                  },
  { "rank": 5, "area_id": "tan-bien",        "area_name": "Tân Biên",        "sample_count": 35, "pinaco_mean": 3.0, "zone": "red",    "main_competitor": "Yamato & Thiên Năng — 5,5/10" }
]
```

---

## Response đầy đủ

```json
{
  "summary": {
    "avg_pinaco_per_10": 4.8,
    "avg_pinaco_pct": 48
  },
  "absolute": [
    {
      "area_id": "trang-bang",
      "area_name": "Trảng Bàng",
      "sample_count": 45,
      "brands": {
        "pinaco": { "mean": 7.2, "mode": 8, "min": 3, "max": 10 },
        "gs":     { "mean": 1.5, "mode": 1, "min": 0, "max": 4  }
      }
    }
  ],
  "territory": [
    {
      "rank": 1,
      "area_id": "trang-bang",
      "area_name": "Trảng Bàng",
      "sample_count": 45,
      "pinaco_mean": 7.2,
      "zone": "green",
      "main_competitor": "GS — 1,5/10"
    }
  ]
}
```

---

## Ghi chú triển khai

| Điểm | Ghi chú |
|------|---------|
| Nguồn sản lượng | Answer code `VELOCITY_CHECK` — `values[].amount` per brand |
| Quy chiếu 10 bình | `brand_per_10 = (brand_amount / totalAmount) × 10` |
| Nhóm theo khu vực | `store.area` trong submission snapshot — cần backfill migration trước |
| Submission hợp lệ | Loại trừ `DELETED`, `SUPERSEDED`, `CANCELLED` |
| Dedup | 1 submission / store (lấy mới nhất) |
| `avg_pinaco_pct` | `= avg_pinaco_per_10 × 10` (vì hệ quy chiếu 10 bình) |
| Bỏ competitive_radar | Không có trong UI — đã loại khỏi response |
