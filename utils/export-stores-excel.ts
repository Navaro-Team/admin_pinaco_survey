import * as XLSX from "xlsx";
import { Store } from "@/model/Store.model";

const formatDate = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

const formatSalesScale = (value?: number): string => {
  if (typeof value !== "number") return "";
  return value.toLocaleString("vi-VN");
};

export const exportStoresToExcel = (stores: Store[], filename?: string) => {
  const rows = (stores || []).map((store, index) => ({
    "STT": index + 1,
    "Mã điểm bán": store.code || "",
    "Tên điểm bán": store.name || "",
    "Loại cửa hàng": store.type || "",
    "Số điện thoại": store.phone || "",
    "Người liên hệ": store.contactPersonName || "",
    "Địa chỉ": store.location?.address || "",
    "Tỉnh/Thành phố": store.province || "",
    "Khu vực": store.area || "",
    "Mã NPP": store.nppCode || "",
    "Tên NPP": store.nppName || "",
    "Nhân viên phụ trách": store.salesEmployeeName || "",
    "Doanh số": formatSalesScale(store.salesScale),
    "Vĩ độ": store.location?.position?.latitude ?? "",
    "Kinh độ": store.location?.position?.longitude ?? "",
    "Ngày tạo": formatDate(store.createdAt),
    "Ngày cập nhật": formatDate(store.updatedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DiemBan");

  const safeDate = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, filename || `danh_sach_diem_ban_${safeDate}.xlsx`);
};
