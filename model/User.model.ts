// User interface based on UserResponse from API
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roles: string[];
  status: string;
  dateOfBirth?: Date | string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  authMethod: 'email' | 'phone';
  createdAt?: Date | string;
  updatedAt?: Date | string;
  avatar?: string; // Optional avatar field for backward compatibility
}

export const parseUser = (user: any): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    roles: user.roles || [],
    status: user.status,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    gender: user.gender,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    authMethod: user.authMethod,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatar: user.avatar,
  };
};

// Map roles to Vietnamese
export const getRoleLabel = (roles: string[]): string => {
  if (!roles || roles.length === 0) return "Nhân viên";
  
  const roleMap: Record<string, string> = {
    admin: "Quản trị viên",
    manager: "Quản lý",
    officer: "Nhân viên",
    sales: "Nhân viên bán hàng",
  };
  
  // Get the first role or default
  const primaryRole = roles[0]?.toLowerCase() || "officer";
  return roleMap[primaryRole] || primaryRole;
};

// Map status to Vietnamese
export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Không hoạt động",
    suspended: "Bị đình chỉ",
    banned: "Bị cấm",
    deleted: "Đã xóa",
    locked: "Bị khóa",
    requires_re_authentication: "Yêu cầu xác thực lại",
  };
  
  return statusMap[status] || status;
};

// Check if status is active
export const isActiveStatus = (status: string): boolean => {
  return status === "active";
};

// Generate staff code from id
export const generateStaffCode = (id: string, index: number): string => {
  // Use last 3 digits of id or index
  const num = id.slice(-3) || String(index + 1).padStart(3, "0");
  return `NV${num}`;
};