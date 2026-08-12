# API — Kiểm Duyệt / QC

## Endpoint

```
GET /api/v1/dashboard/qc
```

Query params: `region`, `staff`, `business_type` (không nhận `categories`)

---

## Nguồn dữ liệu

| Field | Mô tả |
|---|---|
| `supervisorReview.status` | Kết quả QC: `PASSED` = Đạt, `FAILED` = Không đạt. Absent = chưa kiểm tra |
| `metadata.submissionAttempts` | Số lần gửi khảo sát. `≥ 3` = điểm lệch vị trí (yêu cầu hình thứ 3) |

Chỉ lấy submissions hợp lệ: `isDeleted: false`, `status ∉ {DELETED, SUPERSEDED, CANCELLED}`.

---

## Định nghĩa mẫu số

| Metric | Mẫu số |
|---|---|
| Tỷ lệ kiểm tra đối chiếu | `total_completed` (tất cả submissions hợp lệ) |
| Tỷ lệ đạt / Tỷ lệ không đạt | `total_concluded = total_passed + total_failed` (chỉ QC đã có kết luận) |

> Dùng `total_concluded` làm mẫu số cho đạt/không đạt đảm bảo `pass_rate_pct + fail_rate_pct = 100%`.

---

## Response Schema

```typescript
{
  total_completed: number          // Tổng khảo sát hoàn thành (submissions hợp lệ)
  total_reviewed: number           // Số đã được QC (có supervisorReview)
  total_passed: number             // Số QC Đạt
  total_failed: number             // Số QC Không đạt
  total_concluded: number          // total_passed + total_failed
  location_mismatch_count: number  // Số điểm cần chụp hình thứ 3 (submissionAttempts ≥ 3)
  review_rate_pct: number          // total_reviewed / total_completed × 100
  pass_rate_pct: number            // total_passed / total_concluded × 100
  fail_rate_pct: number            // total_failed / total_concluded × 100
}
```

---

## Công thức

```
review_rate_pct  = ROUND(total_reviewed  / total_completed × 100, 1)
pass_rate_pct    = ROUND(total_passed    / total_concluded × 100, 1)
fail_rate_pct    = ROUND(total_failed    / total_concluded × 100, 1)
```

Khi `total_completed = 0` → `review_rate_pct = 0`.  
Khi `total_concluded = 0` → `pass_rate_pct = fail_rate_pct = 0`.

---

## FE Render

**4 KPI cards:**

| Card | Giá trị | Sub-label |
|---|---|---|
| Tỷ lệ kiểm tra đối chiếu | `review_rate_pct%` | `total_reviewed / total_completed khảo sát hoàn thành` |
| Tỷ lệ đạt | `pass_rate_pct%` | `total_passed đạt / total_concluded QC` (xanh lá) |
| Tỷ lệ không đạt | `fail_rate_pct%` | `total_failed không đạt / total_concluded QC` (đỏ) |
| Số điểm lệch vị trí | `location_mismatch_count` | "Tổng khảo sát cần chụp hình thứ 3" |

**2 biểu đồ donut SVG (cùng hàng ở desktop):**

| Biểu đồ | Segment 1 | Segment 2 |
|---|---|---|
| Kết quả kiểm duyệt | Đạt — xanh lá `#22c55e`, `pass_rate_pct%` | Không đạt — đỏ `#ef4444`, `fail_rate_pct%` |
| Tỷ lệ kiểm tra đối chiếu | Đã kiểm tra — xanh `#3b5bdb`, `review_rate_pct%` | Chưa kiểm tra — xám `#dee2e6`, `100 - review_rate_pct%` |

---

## Response đầy đủ

```json
{
  "total_completed": 5,
  "total_reviewed": 2,
  "total_passed": 1,
  "total_failed": 1,
  "total_concluded": 2,
  "location_mismatch_count": 1,
  "review_rate_pct": 40.0,
  "pass_rate_pct": 50.0,
  "fail_rate_pct": 50.0
}
```

---

## Ghi chú triển khai

| Điểm | Ghi chú |
|---|---|
| Projection tối ưu | Query chỉ lấy `supervisorReview.status` và `metadata.submissionAttempts` — không load toàn bộ submission |
| Không dedup per store | Mỗi submission là một lần QC riêng biệt |
| `supervisorReview` absent | Submission chưa được QC — tính vào `total_completed` nhưng không tính vào `total_reviewed` hay `total_concluded` |
| `submissionAttempts < 3` | Bao gồm cả `undefined`/`null` → không tính vào `location_mismatch_count` |
| Tỷ lệ làm tròn | 1 chữ số thập phân (`Math.round(x * 1000) / 10`) |
