export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  authMethod: string;
}

export const parseUser = (user: any): User => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    authMethod: user.authMethod,
  }
}