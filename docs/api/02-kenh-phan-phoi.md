# API — Kênh Phân Phối

## Endpoint

```
GET /api/v1/dashboard/distribution
```

Query params: xem [Bộ lọc toàn cục](./01-dashboard-overview.md#query-params-bộ-lọc-toàn-cục--dùng-chung-cho-4-màn)

---

## Response Schema

```typescript
{
  channel_stats: AreaChannelRow[]
  route_segmentation: AreaRouteSegment[]
}
```

---

## Section 1 — Thống kê kênh phân phối

### AreaChannelRow

Mỗi row là **một khu vực** (lấy từ `store.area`).

```typescript
type RouteType = "le" | "hon_hop" | "si"
// FE map label:
//   "le"      → "Tuyến Lẻ"     (badge xanh dương)
//   "hon_hop" → "Tuyến Hỗn hợp" (badge cam)
//   "si"      → "Tuyến Sỉ"     (badge tím)

type AreaChannelRow = {
  area_id: string            // slugified area name
  area_name: string          // "Trảng Bàng" | "Gò Dầu" | ...
  sample_count: number       // Số mẫu (N) — số submission hợp lệ trong khu vực
  retail_pct: number         // Bán lẻ trung bình (%) — trung bình SALES_PROPORTION.retail trong khu vực
  wholesale_pct: number      // Bán sỉ trung bình (%) = 100 - retail_pct
  dominant_route: RouteType  // Nhóm tuyến nổi trội — phân loại theo ngưỡng bên dưới
}
```

> **Logic phân loại `dominant_route` (BE tính):**
> - `le` (Tuyến Lẻ): `retail_pct` ≥ 70%
> - `si` (Tuyến Sỉ): `wholesale_pct` ≥ 70% (tức `retail_pct` ≤ 30%)
> - `hon_hop` (Tuyến Hỗn hợp): còn lại (30% < retail_pct < 70%)

**FE dùng để render:**
- Bảng: `area_name`, `sample_count`, progress bar `retail_pct` (xanh dương), progress bar `wholesale_pct` (tím), badge `dominant_route`

**Ví dụ:**
```json
[
  {
    "area_id": "trang-bang",
    "area_name": "Trảng Bàng",
    "sample_count": 45,
    "retail_pct": 76,
    "wholesale_pct": 24,
    "dominant_route": "le"
  },
  {
    "area_id": "go-dau",
    "area_name": "Gò Dầu",
    "sample_count": 32,
    "retail_pct": 42,
    "wholesale_pct": 58,
    "dominant_route": "hon_hop"
  },
  {
    "area_id": "duong-minh-chau",
    "area_name": "Dương Minh Châu",
    "sample_count": 28,
    "retail_pct": 25,
    "wholesale_pct": 75,
    "dominant_route": "si"
  }
]
```

**Nguồn dữ liệu:**
- `retail_pct` / `wholesale_pct`: lấy từ answer code `SALES_PROPORTION` — field `retail` (hoặc `banLe`) và `wholesale` (hoặc `banSi`)
- Nhóm theo `store.area` trong submission snapshot (cần đã backfill)

---

## Section 2 — Route Segmentation — Phân cụm tuyến

### AreaRouteSegment

Mỗi row là **một khu vực**, chứa phân bổ số cửa hàng theo 3 nhóm tuyến.

```typescript
type AreaRouteSegment = {
  area_id: string
  area_name: string
  total_count: number       // Tổng số cửa hàng trong khu vực

  le_count: number          // Số cửa hàng Tuyến Lẻ
  le_pct: number            // % Tuyến Lẻ trong khu vực

  hon_hop_count: number     // Số cửa hàng Tuyến Hỗn hợp
  hon_hop_pct: number       // % Tuyến Hỗn hợp

  si_count: number          // Số cửa hàng Tuyến Sỉ
  si_pct: number            // % Tuyến Sỉ
}
```

> Phân loại từng cửa hàng dùng cùng ngưỡng như Section 1.  
> `le_pct + hon_hop_pct + si_pct = 100`

**FE dùng để render:**
- Stacked bar chart 100%: trục X = `area_name`, 3 lớp màu xanh dương / cam / tím
- Label trong thanh: hiện `{pct}%` khi `pct ≥ 10`
- Tooltip: `"{area_name} — {route_label} / {count}/{total_count} cửa hàng / {pct}%"`
- Panel quy tắc bên phải (FE render cứng, không cần BE trả)

**Ví dụ:**
```json
[
  {
    "area_id": "trang-bang",
    "area_name": "Trảng Bàng",
    "total_count": 45,
    "le_count": 31, "le_pct": 68,
    "hon_hop_count": 10, "hon_hop_pct": 22,
    "si_count": 4, "si_pct": 10
  },
  {
    "area_id": "go-dau",
    "area_name": "Gò Dầu",
    "total_count": 32,
    "le_count": 9, "le_pct": 28,
    "hon_hop_count": 15, "hon_hop_pct": 47,
    "si_count": 8, "si_pct": 25
  },
  {
    "area_id": "duong-minh-chau",
    "area_name": "Dương Minh Châu",
    "total_count": 28,
    "le_count": 3, "le_pct": 12,
    "hon_hop_count": 6, "hon_hop_pct": 23,
    "si_count": 19, "si_pct": 65
  }
]
```

---

## Response đầy đủ

```json
{
  "channel_stats": [
    {
      "area_id": "trang-bang",
      "area_name": "Trảng Bàng",
      "sample_count": 45,
      "retail_pct": 76,
      "wholesale_pct": 24,
      "dominant_route": "le"
    }
  ],
  "route_segmentation": [
    {
      "area_id": "trang-bang",
      "area_name": "Trảng Bàng",
      "total_count": 45,
      "le_count": 31, "le_pct": 68,
      "hon_hop_count": 10, "hon_hop_pct": 22,
      "si_count": 4, "si_pct": 10
    }
  ]
}
```

---

## Ghi chú triển khai

| Điểm | Ghi chú |
|------|---------|
| Nguồn `retail_pct` | Answer code `SALES_PROPORTION` — field `retail` hoặc `banLe` (0–100) |
| Nhóm theo khu vực | `store.area` trong submission snapshot — cần backfill migration trước |
| Submission hợp lệ | Loại trừ status `DELETED`, `SUPERSEDED`, `CANCELLED` |
| Dedup | 1 submission / store (lấy mới nhất) |
| Bộ lọc toàn cục | region, staff, business_type, categories áp dụng bình thường |
