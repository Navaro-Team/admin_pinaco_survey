# API — Đánh Giá Dịch Vụ PINACO

## Endpoint

```
GET /api/v1/dashboard/service-eval
```

Query params: xem [Bộ lọc toàn cục](./01-dashboard-overview.md#query-params-bộ-lọc-toàn-cục--dùng-chung-cho-4-màn)
> **Lưu ý:** Endpoint này **không** nhận `categories` — đánh giá dịch vụ không phân theo danh mục sản phẩm.

---

## Nguồn dữ liệu

| Answer code | Nhóm tiêu chí |
|---|---|
| `PINACO_DISTRIBUTOR_EVAL` | Chương trình khuyến mãi (CTKM) |
| `PINACO_GUARANTEE_EVAL` | Bảo hành |
| `PINACO_DELIVERIES_EVAL` | Vận chuyển |

Mỗi answer là một object `{ [subCode]: score }`. Danh sách `subCode` và thang điểm:

| subCode | Tiêu chí hiển thị | Thang | Đảo chiều |
|---|---|---|---|
| `PINACO_PROMOTION_CLARITY` | CTKM dễ hiểu | 1–5 | Không |
| `PINACO_PROMOTION_FREQUENCY` | Tần suất CTKM | 1–5 | Không |
| `PINACO_PROMOTION_COMPARISON` | So sánh CTKM vs đối thủ | 1–3 | Không |
| `PINACO_WARRANTY_CLAIM_DIFFICULTY` | Xác định lỗi BH | 1–5 | Không |
| `PINACO_WARRANTY_PROCESSING_SPEED` | Thời gian xử lý BH | 1–5 | Không |
| `PINACO_WARRANTY_COMPARISON` | So sánh bảo hành vs đối thủ | 1–3 | Không |
| `PINACO_DELIVERY_COST_BURDEN` | Chi phí vận chuyển | 1–5 | **Có** (`score = 6 - score`) |
| `PINACO_DISTRIBUTOR_DELIVERY_SATISFACTION` | Hài lòng vận chuyển | 1–5 | Không |
| `PINACO_DELIVERY_COMPARISON` | So sánh vận chuyển vs đối thủ | 1–3 | Không |

> **Đảo chiều (isNegative):** `PINACO_DELIVERY_COST_BURDEN` là câu hỏi tiêu cực (điểm cao = chi phí cao = xấu). BE đảo chiều trước khi tính: `score = (maxScore + 1) - score` → điểm cao sau đảo = tối ưu chi phí.

---

## Response Schema

```typescript
{
  kpi_summary: ServiceKpiSummary
  satisfaction_by_criteria: Record<string, number>   // key = subCode, value = mean
  service_grid: ServiceCriterionRow[]
}
```

---

## KPI Summary

```typescript
type ServiceKpiSummary = {
  promotion_rating: number    // Điểm CTKM — /5
  warranty_rating: number     // Điểm bảo hành — /5
  delivery_rating: number     // Điểm vận chuyển — /5
  competitor_rating: number   // Điểm so với đối thủ — /3
}
```

**Công thức:**
```
promotion_rating  = Tổng điểm (CLARITY + FREQUENCY)    / Tổng lượt trả lời hợp lệ
warranty_rating   = Tổng điểm (CLAIM_DIFFICULTY + SPEED) / Tổng lượt trả lời hợp lệ
delivery_rating   = Tổng điểm (COST_BURDEN + SATISFACTION) / Tổng lượt trả lời hợp lệ
competitor_rating = Tổng điểm (3 tiêu chí COMPARISON)  / Tổng lượt trả lời hợp lệ
```

> Tính **tổng điểm / tổng lượt** (pool tất cả scores của các tiêu chí trong nhóm), không phải trung bình của trung bình.

**FE render:**
- 4 KPI card theo thứ tự: CTKM (xanh dương), Bảo hành (xanh lá), Vận chuyển (tím), vs Đối thủ (vàng)
- Mỗi card: giá trị hiển thị `x.x / max`, progress bar % = `value / max × 100`

---

## Satisfaction by Criteria (Radar)

```typescript
satisfaction_by_criteria: {
  PINACO_PROMOTION_CLARITY: number              // mean — /5
  PINACO_PROMOTION_FREQUENCY: number            // mean — /5
  PINACO_PROMOTION_COMPARISON: number           // mean — /3
  PINACO_WARRANTY_CLAIM_DIFFICULTY: number      // mean — /5
  PINACO_WARRANTY_PROCESSING_SPEED: number      // mean — /5
  PINACO_WARRANTY_COMPARISON: number            // mean — /3
  PINACO_DELIVERY_COST_BURDEN: number           // mean (đã đảo chiều) — /5
  PINACO_DISTRIBUTOR_DELIVERY_SATISFACTION: number  // mean — /5
  PINACO_DELIVERY_COMPARISON: number            // mean — /3
}
```

**Công thức mỗi tiêu chí:**
```
mean = SUM(điểm hợp lệ của tiêu chí) / Số câu trả lời hợp lệ của tiêu chí
```

**FE render:**
- Biểu đồ radar SVG hình lục giác, 6 trục (loại 3 tiêu chí `COMPARISON`)
- Trục: CTKM dễ hiểu · Tần suất CTKM · Xác định lỗi BH · Thời gian xử lý BH · Chi phí vận chuyển · Hài lòng vận chuyển
- Thang lưới: 1 → 5, fill xanh dương

---

## Service Grid (Bảng thống kê)

```typescript
type ServiceCriterionRow = {
  code: string           // subCode — VD: "PINACO_PROMOTION_CLARITY"
  criteria_name: string  // Tên hiển thị — VD: "CTKM dễ hiểu"
  sample_count: number   // Số câu trả lời hợp lệ
  min: number            // Điểm thấp nhất
  mean: number           // Điểm trung bình (làm tròn 2 chữ số)
  max: number            // Điểm cao nhất
  mode: number           // Điểm phổ biến nhất
}
```

Bảng gồm **9 dòng** (tất cả tiêu chí, kể cả 3 tiêu chí so sánh với đối thủ).

**FE render:**
- Cột: Tiêu chí · Số mẫu · Thấp nhất · Trung bình · Cao nhất · Phổ biến nhất
- Cột Trung bình tô màu theo ngưỡng (tính `mean / max`):
  - ≥ 80% → xanh lá
  - ≥ 60% → xanh dương
  - ≥ 40% → vàng
  - < 40% → đỏ

---

## Response đầy đủ

```json
{
  "kpi_summary": {
    "promotion_rating": 4.6,
    "warranty_rating": 5.0,
    "delivery_rating": 5.0,
    "competitor_rating": 3.0
  },
  "satisfaction_by_criteria": {
    "PINACO_PROMOTION_CLARITY": 4.6,
    "PINACO_PROMOTION_FREQUENCY": 4.6,
    "PINACO_PROMOTION_COMPARISON": 3.0,
    "PINACO_WARRANTY_CLAIM_DIFFICULTY": 5.0,
    "PINACO_WARRANTY_PROCESSING_SPEED": 5.0,
    "PINACO_WARRANTY_COMPARISON": 3.0,
    "PINACO_DELIVERY_COST_BURDEN": 5.0,
    "PINACO_DISTRIBUTOR_DELIVERY_SATISFACTION": 5.0,
    "PINACO_DELIVERY_COMPARISON": 3.0
  },
  "service_grid": [
    { "code": "PINACO_PROMOTION_CLARITY",              "criteria_name": "CTKM dễ hiểu",                     "sample_count": 5, "min": 3, "mean": 4.6, "max": 5, "mode": 5 },
    { "code": "PINACO_PROMOTION_FREQUENCY",            "criteria_name": "Tần suất CTKM",                    "sample_count": 5, "min": 5, "mean": 5.0, "max": 5, "mode": 5 },
    { "code": "PINACO_PROMOTION_COMPARISON",           "criteria_name": "So sánh CTKM vs đối thủ",          "sample_count": 5, "min": 3, "mean": 3.0, "max": 3, "mode": 3 },
    { "code": "PINACO_WARRANTY_CLAIM_DIFFICULTY",      "criteria_name": "Xác định lỗi BH",                  "sample_count": 5, "min": 5, "mean": 5.0, "max": 5, "mode": 5 },
    { "code": "PINACO_WARRANTY_PROCESSING_SPEED",      "criteria_name": "Thời gian xử lý BH",               "sample_count": 5, "min": 5, "mean": 5.0, "max": 5, "mode": 5 },
    { "code": "PINACO_WARRANTY_COMPARISON",            "criteria_name": "So sánh bảo hành vs đối thủ",      "sample_count": 5, "min": 3, "mean": 3.0, "max": 3, "mode": 3 },
    { "code": "PINACO_DELIVERY_COST_BURDEN",           "criteria_name": "Chi phí vận chuyển",               "sample_count": 5, "min": 5, "mean": 5.0, "max": 5, "mode": 5 },
    { "code": "PINACO_DISTRIBUTOR_DELIVERY_SATISFACTION", "criteria_name": "Hài lòng vận chuyển",           "sample_count": 5, "min": 5, "mean": 5.0, "max": 5, "mode": 5 },
    { "code": "PINACO_DELIVERY_COMPARISON",            "criteria_name": "So sánh vận chuyển vs đối thủ",    "sample_count": 5, "min": 3, "mean": 3.0, "max": 3, "mode": 3 }
  ]
}
```

---

## Ghi chú triển khai

| Điểm | Ghi chú |
|---|---|
| Dedup | Không áp dụng dedup per store — mỗi submission đều được tính vào điểm đánh giá |
| Submission hợp lệ | Loại trừ `DELETED`, `SUPERSEDED`, `CANCELLED` |
| Điểm hợp lệ | `val !== null && val !== undefined && val !== ''` và `!isNaN(Number(val))` |
| Đảo chiều | Chỉ `PINACO_DELIVERY_COST_BURDEN`: `score = (5 + 1) - score = 6 - score` |
| Tiêu chí comparison | `PINACO_PROMOTION_COMPARISON`, `PINACO_WARRANTY_COMPARISON`, `PINACO_DELIVERY_COMPARISON` — thang 1–3, không vẽ trên radar nhưng có trong bảng thống kê |
| Thứ tự service_grid | Theo thứ tự khai báo trong `criteriaConfigs` (CTKM → Bảo hành → Vận chuyển) |
