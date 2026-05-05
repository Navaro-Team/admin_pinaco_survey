export interface RoleModel {
  isActive: boolean;
  _id: string;
  name: string;
  description: string;
  permissions: any[];
  createdAt: string;
  updatedAt: string;
}

export const parseRoleModel = (role: any): RoleModel => {
  return {
    isActive: role.isActive,
    _id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

export const parseRoleModels = (roles: any): RoleModel[] => {
  if (!Array.isArray(roles)) return [];
  return roles.map(parseRoleModel);
};