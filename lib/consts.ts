//export const reasonCode={INVALID_CREDENTIALS:"Phương thức đăng nhập không đúng!",AUTH_SERVER_ERROR:"Lỗi xác thực phương thức đăng nhập!",AUTH_SERVICE_ERROR:"Phương thức đăng nhập chưa được hỗ trợ!"}
export const reasonCode = {
  INVALID_PROVIDER:"Phương thức đăng nhập không đúng!",
  INVALID_CREDENTIALS: "Lỗi xác thực phương thức đăng nhập!",
  AUTH_SERVER_ERROR: "Dịch vụ đang bảo trì!",
  AUTH_SERVICE_ERROR: "Phương thức đăng nhập chưa được hỗ trợ!"
} as const;