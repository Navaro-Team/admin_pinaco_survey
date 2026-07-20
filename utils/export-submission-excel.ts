import * as XLSX from "xlsx";

const formatNumber = (n: number | string): string =>
  typeof n === "number" ? n.toLocaleString("vi-VN") : String(n ?? "");

const formatHHmm = (val: any): string => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatDDMMYYYY = (val: any): string => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
};

const formatDateTime = (val: any): string => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return `${formatDDMMYYYY(d)} ${formatHHmm(d)}`;
};

type QuestionCol = {
  code: string;
  header: string;
  type: string;
  question?: any;
  isDetail?: boolean;
  detailGroupCode?: "STORE_AUDIT_STOCK" | "VELOCITY_CHECK" | "PRICE_CHECK" | "PERCEIVED_MARKET_SHARE";
  detailField?: "category" | "brand" | "amount" | "totalAmount" | "typeName" | "sku" | "prices" | "count";
};

function getQuestionColumns(questions: any[]): QuestionCol[] {
  const cols: QuestionCol[] = [];
  for (const q of questions || []) {
    if (q.type === "LIKERT_SCALE_GROUP" && Array.isArray(q.items)) {
      for (const item of q.items) {
        cols.push({
          code: item.code || item.id,
          header: item.title || item.label || item.code || "",
          type: "LIKERT_ITEM",
          question: { ...q, item },
          isDetail: false,
        });
      }
      continue;
    }

    if (q.code === "STORE_AUDIT_STOCK" || q.code === "VELOCITY_CHECK") {
      cols.push(
        { code: `${q.code}_CATEGORY`, header: "Danh mục", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "category" },
        { code: `${q.code}_BRAND`, header: "Thương hiệu", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "brand" },
        { code: `${q.code}_AMOUNT`, header: "Giá trị (VNĐ)", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "amount" },
        { code: `${q.code}_TOTAL`, header: "Tổng cộng", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "totalAmount" }
      );
      continue;
    }

    if (q.code === "PERCEIVED_MARKET_SHARE") {
      cols.push(
        { code: `${q.code}_BRAND`, header: "Thương hiệu", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "brand" },
        { code: `${q.code}_COUNT`, header: "Số lượng", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "count" }
      );
      continue;
    }

    if (q.code === "PRICE_CHECK") {
      cols.push(
        { code: `${q.code}_TYPE`, header: "Loại/Lĩnh vực", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "typeName" },
        { code: `${q.code}_SKU`, header: "SKU", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "sku" },
        { code: `${q.code}_PRICES`, header: "Giá theo nhãn hiệu", type: q.type || "MIXED", question: q, isDetail: true, detailGroupCode: q.code, detailField: "prices" }
      );
      continue;
    }

    cols.push({ code: q.code, header: q.instruction || q.title || q.code || "", type: q.type || "TEXT", question: q, isDetail: false });
  }
  return cols;
}

function formatAnswerValue(
  questionCol: QuestionCol,
  answer: any,
  answersMap: Map<string, { answer: any; questionType?: string }>
): string {
  const { type, code, question } = questionCol;
  const raw = answer ?? null;
  if (raw === null || raw === undefined) return "";

  const qt = answersMap.get(code)?.questionType || type;
  const effectiveType = code === "SCALE_QUOTA_CHECK" ? "SCALE_QUOTA_CHECK" : qt;

  switch (effectiveType) {
    case "BOOLEAN": {
      if (typeof raw === "object" && raw !== null && "hasSignage" in raw) {
        const label = raw.hasSignage ? "Có" : "Không";
        const detail = raw.value !== undefined && raw.value !== null && raw.value !== ""
          ? raw.hasSignage ? ` (SL: ${raw.value})` : ` — ${raw.value}`
          : raw.amount != null ? ` (SL: ${raw.amount})` : "";
        return `${label}${detail}`;
      }
      return raw ? "Có" : "Không";
    }
    case "DROPDOWN":
    case "SINGLE_CHOICE": {
      return typeof raw === "object" ? raw?.text ?? raw?.label ?? raw?.name ?? "" : String(raw);
    }
    case "MULTI_CHOICE": {
      if (!Array.isArray(raw)) return String(raw ?? "");
      return raw.map((x: any) => typeof x === "object" ? x?.brandName ?? x?.categoryName ?? x?.text ?? x?.label ?? x?.name ?? "" : String(x)).filter(Boolean).join("; ");
    }
    case "NUMBER_INPUT": {
      if (raw?.retail != null && raw?.wholesale != null) return `Bán lẻ: ${raw.retail}%; Bán sỉ: ${raw.wholesale}%`;
      if (raw?.totalAmount != null && Array.isArray(raw?.values)) return `Tổng: ${formatNumber(raw.totalAmount)} VNĐ (${raw.values.length} dòng)`;
      if (typeof raw === "object" && raw?.value != null) return String(raw.value);
      if (typeof raw === "number") return formatNumber(raw);
      return String(raw ?? "");
    }
    case "SCALE_QUOTA_CHECK": {
      if (typeof raw === "object") {
        if (raw?.amount != null) return formatNumber(raw.amount);
        if (raw?.level != null) return [raw.level, raw.quote, raw.amount].filter(Boolean).join(" | ");
      }
      if (typeof raw === "number") return formatNumber(raw);
      return String(raw ?? "");
    }
    case "STORE_AUDIT_STOCK": {
      if (!raw || typeof raw !== "object") return "";
      const total = raw.totalAmount != null ? formatNumber(raw.totalAmount) : "";
      const n = Array.isArray(raw.values) ? raw.values.length : 0;
      return total ? `Tổng: ${total} VNĐ${n ? ` (${n} dòng)` : ""}` : "";
    }
    case "VELOCITY_CHECK": {
      if (!raw || typeof raw !== "object") return "";
      const total = raw.totalAmount != null ? formatNumber(raw.totalAmount) + " VNĐ" : "";
      const n = Array.isArray(raw.values) ? raw.values.length : 0;
      return total ? `${total}${n ? ` (${n} dòng)` : ""}` : "";
    }
    case "PERCEIVED_MARKET_SHARE": {
      if (!Array.isArray(raw)) return "";
      return raw.map((x: any) => (x?.brandName || x?.brandCode || "") + ": " + (x?.count ?? 0)).filter(Boolean).join("; ");
    }
    case "PRICE_CHECK": {
      if (!Array.isArray(raw)) return "";
      return raw.map((r: any) => {
        const typeName = r?.batteryTypeName || r?.batteryTypeCode || "";
        const sku = r?.sku || "";
        const prices = r?.prices && typeof r.prices === "object"
          ? Object.entries(r.prices).map(([k, v]) => `${k}: ${formatNumber(v as number)}`).join(", ")
          : "";
        return [typeName, sku, prices].filter(Boolean).join(" | ");
      }).join("\n");
    }
    case "FILE_UPLOAD": {
      const arr = Array.isArray(raw) ? raw : [];
      return arr.length ? `${arr.length} ảnh` : "";
    }
    case "LIKERT_ITEM": {
      const v = typeof raw === "number" ? raw : raw?.value ?? raw;
      if (v == null) return "";
      const scale = question?.item?.scale || question?.scale;
      if (Array.isArray(scale) && scale.length) {
        const label = scale.find((s: any) => s.value === Number(v))?.label;
        return label != null ? `${v} (${label})` : String(v);
      }
      return String(v);
    }
    case "LIKERT_SCALE_GROUP": {
      if (!raw || typeof raw !== "object") return "";
      return Object.entries(raw).map(([k, v]) => `${k}: ${v}`).filter(Boolean).join("; ");
    }
    case "MIXED":
      if (Array.isArray(raw)) return raw.map((x: any) => (x?.brandName || x?.brandCode || "") + ": " + (x?.count ?? x?.amount ?? "")).filter(Boolean).join("; ");
      if (raw && typeof raw === "object") {
        if (raw.totalAmount != null) return `Tổng: ${formatNumber(raw.totalAmount)} VNĐ`;
        return JSON.stringify(raw).slice(0, 200);
      }
      return String(raw ?? "");
    default:
      if (typeof raw === "object") return JSON.stringify(raw).slice(0, 300);
      return String(raw ?? "");
  }
}

function getAnswerCells(
  questionCols: QuestionCol[],
  answersMap: Map<string, { answer: any; questionType?: string }>
): string[] {
  return questionCols.map((col) => {
    const data = answersMap.get(col.code);
    return formatAnswerValue(col, data?.answer, answersMap);
  });
}

function getDetailRecordsForQuestion(
  questionCol: QuestionCol,
  answersMap: Map<string, { answer: any; questionType?: string }>
): string[] {
  if (!questionCol.isDetail || !questionCol.detailGroupCode || !questionCol.detailField) return [];

  const groupCode = questionCol.detailGroupCode;
  const dataEntry = answersMap.get(groupCode)?.answer;
  if (!dataEntry) return [];

  if (groupCode === "STORE_AUDIT_STOCK" || groupCode === "VELOCITY_CHECK") {
    const values = Array.isArray(dataEntry.values) ? dataEntry.values : [];
    if (questionCol.detailField === "totalAmount") {
      const total = dataEntry?.totalAmount;
      const formatted = total != null ? `${formatNumber(total)} VNĐ` : "";
      const n = Math.max(1, values.length);
      return Array.from({ length: n }, (_, i) => (i === 0 ? formatted : ""));
    }
    return values.map((item: any) => {
      if (questionCol.detailField === "category") return item?.categoryName || item?.category || "";
      if (questionCol.detailField === "brand") return item?.brandName || item?.brandCode || "";
      if (questionCol.detailField === "amount") return item?.amount != null ? `${formatNumber(item.amount)} VNĐ` : "";
      return "";
    });
  }

  if (groupCode === "PERCEIVED_MARKET_SHARE" && Array.isArray(dataEntry)) {
    return dataEntry.map((item: any) => {
      if (questionCol.detailField === "brand") return item?.brandName || item?.brandCode || "";
      if (questionCol.detailField === "count") return item?.count != null ? `${item.count}` : "";
      return "";
    });
  }

  if (groupCode === "PRICE_CHECK" && Array.isArray(dataEntry)) {
    return dataEntry.map((row: any) => {
      if (questionCol.detailField === "typeName") return row?.batteryTypeName || row?.batteryTypeCode || "";
      if (questionCol.detailField === "sku") return row?.sku || "";
      if (questionCol.detailField === "prices") {
        return row?.prices && typeof row.prices === "object"
          ? Object.entries(row.prices).map(([k, v]) => `${k}: ${formatNumber(v as number)}`).join(", ")
          : "";
      }
      return "";
    });
  }

  return [];
}

function buildAnswersMap(answers: any[]): Map<string, { answer: any; questionType?: string }> {
  const m = new Map<string, { answer: any; questionType?: string }>();
  for (const a of answers || []) {
    if (a?.code) m.set(a.code, { answer: a.answer, questionType: a.questionType });
  }
  for (const a of answers || []) {
    if (a?.questionType === "LIKERT_SCALE_GROUP" && a?.answer && typeof a.answer === "object") {
      for (const [itemCode, value] of Object.entries(a.answer)) {
        if (!m.has(itemCode)) m.set(itemCode, { answer: value, questionType: "LIKERT_ITEM" });
      }
    }
  }
  return m;
}

const QC_STATUS_LABEL: Record<string, string> = {
  PASSED: "Đạt",
  FAILED: "Không đạt",
};

export interface ExportSubmissionExcelParams {
  survey: any;
  submissions: any[];
  filename?: string;
}

export function exportSubmissionToExcel({ survey, submissions, filename = "ket_qua_khao_sat.xlsx" }: ExportSubmissionExcelParams): void {
  const questions = survey?.surveyData?.questions ?? survey?.questions ?? [];
  const questionCols = getQuestionColumns(questions);

  const headerRow1 = [
    "STT",
    "Tên điểm bán",
    "Địa chỉ",
    "SĐT điểm bán",
    "Loại hình",
    "Họ tên (assignee)",
    "Email (assignee)",
    "SĐT (assignee)",
    "Check-in",
    "Check-out",
    "Ngày khảo sát",
    ...questionCols.map((c) => c.question?.instruction || c.header),
    "Trạng thái QC",
    "Người QC",
    "Thời gian QC",
  ];

  const headerRow2 = [
    "STT",
    "Tên điểm bán",
    "Địa chỉ",
    "SĐT điểm bán",
    "Loại hình",
    "Họ tên (assignee)",
    "Email (assignee)",
    "SĐT (assignee)",
    "Check-in",
    "Check-out",
    "Ngày khảo sát",
    ...questionCols.map((c) => c.header),
    "Trạng thái QC",
    "Người QC",
    "Thời gian QC",
  ];

  const rows: (string | number)[][] = [headerRow1, headerRow2];
  const merges: XLSX.Range[] = [];

  // Merge header rows for fixed info columns (0–10)
  for (let c = 0; c <= 10; c++) {
    merges.push({ s: { r: 0, c }, e: { r: 1, c } });
  }

  // Merge header rows for question columns
  let colIdx = 11;
  for (const col of questionCols) {
    if (!col.isDetail) {
      merges.push({ s: { r: 0, c: colIdx }, e: { r: 1, c: colIdx } });
      colIdx += 1;
    } else {
      const isFirstOfGroup =
        col.detailField === "category" ||
        col.detailField === "typeName" ||
        (col.detailGroupCode === "PERCEIVED_MARKET_SHARE" && col.detailField === "brand");
      if (isFirstOfGroup) {
        const span =
          col.detailGroupCode === "PERCEIVED_MARKET_SHARE" ? 1
            : col.detailGroupCode === "STORE_AUDIT_STOCK" || col.detailGroupCode === "VELOCITY_CHECK" ? 3
              : 2;
        merges.push({ s: { r: 0, c: colIdx }, e: { r: 0, c: colIdx + span } });
      }
      colIdx += 1;
    }
  }

  // Merge header rows for QC columns (each standalone)
  for (let c = colIdx; c < colIdx + 3; c++) {
    merges.push({ s: { r: 0, c }, e: { r: 1, c } });
  }
  const qcColStart = colIdx;

  let stt = 0;

  for (const submission of submissions || []) {
    stt += 1;
    const store = submission?.store ?? {};
    const assignee = submission?.assignee ?? {};
    const answersMap = buildAnswersMap(submission?.answers ?? []);
    const supervisorReview = submission?.supervisorReview ?? null;

    const qcStatus = supervisorReview?.status ? (QC_STATUS_LABEL[supervisorReview.status] ?? supervisorReview.status) : "";
    const qcReviewer = supervisorReview?.reviewerName ?? "";
    const qcTime = supervisorReview?.reviewedAt ? formatDateTime(supervisorReview.reviewedAt) : "";

    const baseAnswers = getAnswerCells(questionCols, answersMap);
    const detailRecordsPerCol = questionCols.map((col) => getDetailRecordsForQuestion(col, answersMap));
    const maxDetailRows = Math.max(1, ...detailRecordsPerCol.map((r) => r.length || 0));

    const taskStartRow = rows.length;

    for (let i = 0; i < maxDetailRows; i++) {
      const infoCells = [
        i === 0 ? stt : "",
        i === 0 ? store?.name ?? "" : "",
        i === 0 ? store?.location?.address ?? "" : "",
        i === 0 ? store?.phone ?? "" : "",
        i === 0 ? store?.type ?? "" : "",
        i === 0 ? assignee?.name ?? "" : "",
        i === 0 ? assignee?.email ?? "" : "",
        i === 0 ? assignee?.phone ?? "" : "",
        i === 0 ? formatHHmm(submission?.checkinTime) : "",
        i === 0 ? formatHHmm(submission?.checkoutTime) : "",
        i === 0 ? formatDDMMYYYY(submission?.createdAt) : "",
      ];

      const answerCells = questionCols.map((col, idx) => {
        if (col.isDetail) {
          const records = detailRecordsPerCol[idx];
          return i < records.length ? records[i] : "";
        }
        return i === 0 ? baseAnswers[idx] : "";
      });

      const qcCells = [
        i === 0 ? qcStatus : "",
        i === 0 ? qcReviewer : "",
        i === 0 ? qcTime : "",
      ];

      rows.push([...infoCells, ...answerCells, ...qcCells]);
    }

    const taskEndRow = rows.length - 1;

    if (taskEndRow > taskStartRow) {
      const mergeColIndexes: number[] = [];
      for (let c = 0; c <= 10; c++) mergeColIndexes.push(c);
      let ci = 11;
      for (const col of questionCols) {
        if (!col.isDetail || col.detailField === "totalAmount") mergeColIndexes.push(ci);
        ci += 1;
      }
      for (let c = qcColStart; c < qcColStart + 3; c++) mergeColIndexes.push(c);
      mergeColIndexes.forEach((c) => {
        merges.push({ s: { r: taskStartRow, c }, e: { r: taskEndRow, c } });
      });
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 5 },   // STT
    { wch: 22 },  // Tên điểm bán
    { wch: 45 },  // Địa chỉ
    { wch: 14 },  // SĐT điểm bán
    { wch: 18 },  // Loại hình
    { wch: 22 },  // Họ tên
    { wch: 28 },  // Email
    { wch: 12 },  // SĐT assignee
    { wch: 12 },  // Check-in
    { wch: 12 },  // Check-out
    { wch: 14 },  // Ngày khảo sát
    ...questionCols.map(() => ({ wch: 24 })),
    { wch: 16 },  // Trạng thái QC
    { wch: 22 },  // Người QC
    { wch: 20 },  // Thời gian QC
  ];
  if (merges.length) ws["!merges"] = merges;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kết quả khảo sát");
  XLSX.writeFile(wb, filename);
}
