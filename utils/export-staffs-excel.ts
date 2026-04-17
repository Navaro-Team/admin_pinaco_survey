import * as XLSX from "xlsx";
import { getRoleLabel, getStatusLabel, User } from "@/model/User.model";

const formatDate = (value?: string | Date): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

const formatAuthMethod = (method?: User["authMethod"]): string => {
  if (method === "email") return "Email";
  if (method === "phone") return "Số điện thoại";
  return "";
};

export const exportStaffsToExcel = (staffs: User[], filename?: string) => {
  const rows = (staffs || []).map((staff, index) => ({
    "STT": index + 1,
    "Mã nhân viên": staff.code || "",
    "Tên nhân viên": staff.name || "",
    "Email": staff.email || "",
    "Số điện thoại": staff.phone || "",
    "Vai trò": getRoleLabel(staff.roles || []),
    "Trạng thái": getStatusLabel(staff.status || ""),
    "Ngày sinh": formatDate(staff.dateOfBirth),
    "Phương thức đăng nhập": formatAuthMethod(staff.authMethod),
    "Email xác thực": staff.isEmailVerified ? "Có" : "Không",
    "SĐT xác thực": staff.isPhoneVerified ? "Có" : "Không",
    "Ngày tạo": formatDate(staff.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NhanSu");

  const safeDate = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, filename || `danh_sach_nhan_su_${safeDate}.xlsx`);
};
