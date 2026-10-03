import * as XLSX from "xlsx";
import type { CleanupAction, CleanupItem } from "@/features/survey-cleanup/survey-cleanup.types";

/**
 * Reads the QC review summary (summary.xlsx).
 * - REMOVE   → sheet "Số điểm bỏ khảo sát"  (column "Mã điểm bán")
 * - RESURVEY → sheet "Số điểm khảo sát lại" (columns "Mã điểm bán", "mã NVBH")
 * Falls back to any sheet whose "Bỏ khỏi khảo sát" / "Yêu cầu khảo sát lại" column is marked with "x".
 */

const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const CONFIG: Record<CleanupAction, { sheet: string; markColumn: string }> = {
  REMOVE: { sheet: "số điểm bỏ khảo sát", markColumn: "bỏ khỏi khảo sát" },
  RESURVEY: { sheet: "số điểm khảo sát lại", markColumn: "yêu cầu khảo sát lại" },
};

const STORE_CODE_COLUMN = "mã điểm bán";
const EMPLOYEE_CODE_COLUMN = "mã nvbh";

type Rows = unknown[][];

const findColumn = (header: unknown[], name: string) =>
  header.findIndex((cell) => normalize(cell).startsWith(name));

const readRows = (sheet: XLSX.WorkSheet): Rows =>
  XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });

export async function parseCleanupExcel(file: File, action: CleanupAction): Promise<CleanupItem[]> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const { sheet: sheetName, markColumn } = CONFIG[action];

  const namedSheet = workbook.SheetNames.find((name) => normalize(name) === sheetName);
  let rows: Rows;
  let markIdx = -1;

  if (namedSheet) {
    rows = readRows(workbook.Sheets[namedSheet]);
  } else {
    const fallback = workbook.SheetNames
      .map((name) => readRows(workbook.Sheets[name]))
      .find((r) => findColumn(r[0] ?? [], markColumn) >= 0);
    if (!fallback) {
      throw new Error(`Không tìm thấy sheet "${namedSheetLabel(action)}" trong file.`);
    }
    rows = fallback;
    markIdx = findColumn(rows[0], markColumn);
  }

  const header = rows[0] ?? [];
  const storeIdx = findColumn(header, STORE_CODE_COLUMN);
  if (storeIdx < 0) throw new Error(`Không tìm thấy cột "Mã điểm bán".`);

  const employeeIdx = findColumn(header, EMPLOYEE_CODE_COLUMN);
  if (action === "RESURVEY" && employeeIdx < 0) throw new Error(`Không tìm thấy cột "mã NVBH".`);

  return rows
    .slice(1)
    .filter((row) => String(row[storeIdx] ?? "").trim())
    .filter((row) => markIdx < 0 || normalize(row[markIdx]) === "x")
    .map((row) => ({
      storeCode: String(row[storeIdx]).trim(),
      ...(action === "RESURVEY" && { employeeCode: String(row[employeeIdx] ?? "").trim() }),
    }));
}

export const namedSheetLabel = (action: CleanupAction) =>
  action === "REMOVE" ? "Số điểm bỏ khảo sát" : "Số điểm khảo sát lại";
