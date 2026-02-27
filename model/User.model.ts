// User interface based on UserResponse from API
export interface User {
  id: string;
  code: string;
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
    code: user.code,
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

export const parseUsers = (users: any): User[] => {
  if (!Array.isArray(users)) return [];
  return users.map(parseUser);
};

// Map roles to Vietnamese
export const getRoleLabel = (roles: string[]): string => {
  if (!roles || roles.length === 0) return "Nhân viên";

  const roleMap: Record<string, string> = {
    admin: "Quản trị viên",
    manager: "Quản lý",
    sales: "Nhân viên bán hàng",
    sales_supervisor: "Quản lý bán hàng",
    area_sales_manager: "Quản lý khu vực",
  };

  // Get the first role or default
  const primaryRole = roles[0]?.toLowerCase() || "sales";
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