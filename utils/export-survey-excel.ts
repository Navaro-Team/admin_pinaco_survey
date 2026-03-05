import * as XLSX from "xlsx";

const formatNumber = (n: number | string): string =>
  typeof n === "number" ? n.toLocaleString("vi-VN") : String(n ?? "");

type QuestionCol = {
  code: string;
  header: string;
  type: string;
  question?: any;
  isDetail?: boolean;
  detailGroupCode?: "STORE_AUDIT_STOCK" | "VELOCITY_CHECK" | "PRICE_CHECK" | "PERCEIVED_MARKET_SHARE";
  detailField?: "category" | "brand" | "amount" | "totalAmount" | "typeName" | "sku" | "prices" | "count";
};

const DETAIL_CODES = new Set(["STORE_AUDIT_STOCK", "VELOCITY_CHECK", "PRICE_CHECK", "PERCEIVED_MARKET_SHARE"]);

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
        {
          code: `${q.code}_CATEGORY`,
          header: "Danh mục",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "category",
        },
        {
          code: `${q.code}_BRAND`,
          header: "Thương hiệu",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "brand",
        },
        {
          code: `${q.code}_AMOUNT`,
          header: "Giá trị (VNĐ)",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "amount",
        },
        {
          code: `${q.code}_TOTAL`,
          header: "Tổng cộng",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "totalAmount",
        }
      );
      continue;
    }

    if (q.code === "PERCEIVED_MARKET_SHARE") {
      cols.push(
        {
          code: `${q.code}_BRAND`,
          header: "Thương hiệu",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "brand",
        },
        {
          code: `${q.code}_COUNT`,
          header: "Số lượng",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "count",
        }
      );
      continue;
    }

    if (q.code === "PRICE_CHECK") {
      cols.push(
        {
          code: `${q.code}_TYPE`,
          header: "Loại/Lĩnh vực",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "typeName",
        },
        {
          code: `${q.code}_SKU`,
          header: "SKU",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "sku",
        },
        {
          code: `${q.code}_PRICES`,
          header: "Giá theo nhãn hiệu",
          type: q.type || "MIXED",
          question: q,
          isDetail: true,
          detailGroupCode: q.code,
          detailField: "prices",
        }
      );
      continue;
    }

    cols.push({
      code: q.code,
      header: q.instruction || q.title || q.code || "",
      type: q.type || "TEXT",
      question: q,
      isDetail: false,
    });
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
        const v = raw.hasSignage ? "Có" : "Không";
        return raw.amount != null ? `${v} (SL: ${raw.amount})` : v;
      }
      return raw ? "Có" : "Không";
    }
    case "DROPDOWN":
    case "SINGLE_CHOICE": {
      const t = typeof raw === "object" ? raw?.text ?? raw?.label ?? raw?.name ?? "" : String(raw);
      return t;
    }
    case "MULTI_CHOICE": {
      if (!Array.isArray(raw)) return String(raw ?? "");
      return raw
        .map((x: any) => (typeof x === "object" ? x?.brandName ?? x?.categoryName ?? x?.text ?? x?.label ?? x?.name ?? "" : String(x)))
        .filter(Boolean)
        .join("; ");
    }
    case "NUMBER_INPUT": {
      if (raw?.retail != null && raw?.wholesale != null) {
        return `Bán lẻ: ${raw.retail}%; Bán sỉ: ${raw.wholesale}%`;
      }
      if (raw?.totalAmount != null && Array.isArray(raw?.values)) {
        const total = formatNumber(raw.totalAmount);
        return `Tổng: ${total} VNĐ (${raw.values.length} dòng)`;
      }
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
      return raw
        .map((x: any) => (x?.brandName || x?.brandCode || "") + ": " + (x?.count ?? 0))
        .filter(Boolean)
        .join("; ");
    }
    case "PRICE_CHECK": {
      if (!Array.isArray(raw)) return "";
      return raw
        .map((r: any) => {
          const typeName = r?.batteryTypeName || r?.batteryTypeCode || "";
          const sku = r?.sku || "";
          const prices = r?.prices && typeof r.prices === "object"
            ? Object.entries(r.prices)
                .map(([k, v]) => `${k}: ${formatNumber(v as number)}`)
                .join(", ")
            : "";
          return [typeName, sku, prices].filter(Boolean).join(" | ");
        })
        .join("\n");
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
      const parts = Object.entries(raw)
        .map(([k, v]) => `${k}: ${v}`)
        .filter(Boolean);
      return parts.join("; ");
    }
    case "MIXED":
      if (Array.isArray(raw)) {
        return raw
          .map((x: any) => (x?.brandName || x?.brandCode || "") + ": " + (x?.count ?? x?.amount ?? ""))
          .filter(Boolean)
          .join("; ");
      }
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
  if (!questionCol.isDetail || !questionCol.detailGroupCode || !questionCol.detailField)
    return [];

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
      if (questionCol.detailField === "category") {
        return item?.categoryName || item?.category || "";
      }
      if (questionCol.detailField === "brand") {
        return item?.brandName || item?.brandCode || "";
      }
      if (questionCol.detailField === "amount") {
        return item?.amount != null ? `${formatNumber(item.amount)} VNĐ` : "";
      }
      return "";
    });
  }

  if (groupCode === "PERCEIVED_MARKET_SHARE" && Array.isArray(dataEntry)) {
    return dataEntry.map((item: any) => {
      if (questionCol.detailField === "brand") {
        return item?.brandName || item?.brandCode || "";
      }
      if (questionCol.detailField === "count") {
        return item?.count != null ? `${item.count}` : "";
      }
      return "";
    });
  }

  if (groupCode === "PRICE_CHECK" && Array.isArray(dataEntry)) {
    return dataEntry.map((row: any) => {
      if (questionCol.detailField === "typeName") {
        return row?.batteryTypeName || row?.batteryTypeCode || "";
      }
      if (questionCol.detailField === "sku") {
        return row?.sku || "";
      }
      if (questionCol.detailField === "prices") {
        const prices =
          row?.prices && typeof row.prices === "object"
            ? Object.entries(row.prices)
                .map(([k, v]) => `${k}: ${formatNumber(v as number)}`)
                .join(", ")
            : "";
        return prices;
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
  if (m.size === 0) return m;

  for (const a of answers || []) {
    if (a?.questionType === "LIKERT_SCALE_GROUP" && a?.answer && typeof a.answer === "object") {
      for (const [itemCode, value] of Object.entries(a.answer)) {
        if (!m.has(itemCode)) m.set(itemCode, { answer: value, questionType: "LIKERT_ITEM" });
      }
    }
  }
  return m;
}

export interface ExportSurveyExcelParams {
  survey: any;
  tasks: any[];
  filename?: string;
  getPerformByInfo?: (task: any) => string;
}

export function exportSurveyToExcel(params: ExportSurveyExcelParams): void {
  const { survey, tasks, filename = "khảo_sát.xlsx", getPerformByInfo } = params;
  const questions = survey?.surveyData?.questions ?? survey?.questions ?? [];
  const questionCols = getQuestionColumns(questions);

  const headerRow1 = [
    "STT",
    "Tên cửa hàng",
    "Địa chỉ",
    "SĐT cửa hàng",
    "Loại hình",
    "Quy mô doanh số",
    "Họ tên (assignee)",
    "Email (assignee)",
    "SĐT (assignee)",
    "Người thực hiện",
    ...questionCols.map((c) => c.question?.instruction || c.header),
  ];

  const headerRow2 = [
    "STT",
    "Tên cửa hàng",
    "Địa chỉ",
    "SĐT cửa hàng",
    "Loại hình",
    "Quy mô doanh số",
    "Họ tên (assignee)",
    "Email (assignee)",
    "SĐT (assignee)",
    "Người thực hiện",
    ...questionCols.map((c) => c.header),
  ];

  const rows: (string | number)[][] = [headerRow1, headerRow2];
  const merges: XLSX.Range[] = [];

  for (let c = 0; c <= 9; c++) {
    merges.push({ s: { r: 0, c }, e: { r: 1, c } });
  }
  let colIdx = 10;
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
          col.detailGroupCode === "PERCEIVED_MARKET_SHARE"
            ? 1
            : col.detailGroupCode === "STORE_AUDIT_STOCK" || col.detailGroupCode === "VELOCITY_CHECK"
              ? 3
              : 2;
        merges.push({ s: { r: 0, c: colIdx }, e: { r: 0, c: colIdx + span } });
      }
      colIdx += 1;
    }
  }

  let stt = 0;

  for (const task of tasks || []) {
    stt += 1;
    const store = task?.store ?? {};
    const assignee = task?.assignee ?? {};
    const submission = task?.submission ?? {};
    const answersMap = buildAnswersMap(submission?.answers ?? []);
    const salesScale = store?.salesScale ?? (task as any)?.salesScale ?? null;
    const salesScaleText = salesScale != null ? `${formatNumber(salesScale)} VNĐ` : "";
    const performBy =
      typeof getPerformByInfo === "function"
        ? getPerformByInfo(task)
        : assignee?.name ?? submission?.createdBy ?? "";

    const baseAnswers = getAnswerCells(questionCols, answersMap);
    const detailRecordsPerCol: string[][] = questionCols.map((col) =>
      getDetailRecordsForQuestion(col, answersMap)
    );
    const maxDetailRows =
      Math.max(1, ...detailRecordsPerCol.map((records) => records.length || 0)) || 1;

    const taskStartRow = rows.length; 

    for (let i = 0; i < maxDetailRows; i++) {
      const infoCells = [
        i === 0 ? stt : "",
        i === 0 ? store?.name ?? "" : "",
        i === 0 ? store?.location?.address ?? "" : "",
        i === 0 ? store?.phone ?? "" : "",
        i === 0 ? store?.type ?? "" : "",
        i === 0 ? salesScaleText : "",
        i === 0 ? assignee?.name ?? "" : "",
        i === 0 ? assignee?.email ?? "" : "",
        i === 0 ? assignee?.phone ?? "" : "",
        i === 0 ? performBy : "",
      ];

      const answerCells = questionCols.map((col, idx) => {
        if (col.isDetail) {
          const records = detailRecordsPerCol[idx];
          return i < records.length ? records[i] : "";
        }
        return i === 0 ? baseAnswers[idx] : "";
      });

      rows.push([...infoCells, ...answerCells]);
    }
    const taskEndRow = rows.length - 1;

    if (taskEndRow > taskStartRow) {
      const mergeColIndexes: number[] = [];
      for (let c = 0; c <= 9; c++) mergeColIndexes.push(c);
      let colIdx = 10;
      for (const col of questionCols) {
        const shouldMerge =
          !col.isDetail || col.detailField === "totalAmount";
        if (shouldMerge) mergeColIndexes.push(colIdx);
        colIdx += 1;
      }
      mergeColIndexes.forEach((c) => {
        merges.push({ s: { r: taskStartRow, c }, e: { r: taskEndRow, c } });
      });
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const colWidths = questionCols.map(() => ({ wch: 24 }));
  ws["!cols"] = [
    { wch: 5 },
    { wch: 22 },
    { wch: 45 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 28 },
    { wch: 12 },
    { wch: 22 },
    ...colWidths,
  ];
  if (merges.length) {
    ws["!merges"] = merges;
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Khảo sát");
  XLSX.writeFile(wb, filename);
}
