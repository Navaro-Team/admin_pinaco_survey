export const cookieUtils = {
  set: (name: string, value: string, options?: {
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    maxAge?: number;
  }) => {
    if (typeof document !== 'undefined') {
      let cookieString = `${name}=${value}`;
      
      if (options?.expires) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
      if (options?.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
      }
      if (options?.path) {
        cookieString += `; path=${options.path}`;
      }
      if (options?.httpOnly) {
        cookieString += `; HttpOnly`;
      }
      if (options?.secure) {
        cookieString += `; Secure`;
      }
      if (options?.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
      }
      
      document.cookie = cookieString;
    }
  },
  
  get: (name: string): string | null => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
    }
    return null;
  },
  
  remove: (name: string, path: string = '/') => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    }
  }
};
