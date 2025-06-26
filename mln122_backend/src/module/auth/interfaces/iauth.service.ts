// src/auth/interfaces/auth.service.interface.ts

/**
 * DTO cho dữ liệu trả về sau khi đăng nhập thành công hoặc làm mới token.
 */
export interface LoginResponseDto {
  accessToken: string
  // Bạn có thể thêm thông tin người dùng nếu cần
  // user: { id: string; email: string; fullName: string; picture?: string; }
}

/**
 * DTO cho dữ liệu profile nhận về từ Google Strategy.
 * Giúp code của bạn type-safe hơn là dùng `any`.
 */
export interface GoogleProfileDto {
  id: string
  email: string
  fullName: string
  picture?: string
}

/**
 * Định nghĩa các phương thức cho dịch vụ xác thực.
 */
export interface IAuthService {
  /**
   * Xử lý đăng nhập hoặc đăng ký người dùng dựa trên thông tin từ Google.
   * @param profile Dữ liệu người dùng từ Google
   * @returns Promise chứa accessToken và refreshToken
   */
  signInWithGoogle(profile: GoogleProfileDto): Promise<LoginResponseDto>

  /**
   * Đăng xuất người dùng. Có thể bao gồm việc vô hiệu hóa refresh token.
   * @param userId ID của người dùng cần đăng xuất
   * @returns Promise<void>
   */
  logout(userId: string): Promise<void>

  /**
   * Sử dụng refresh token để cấp lại access token mới.
   * @param refreshToken Refresh token cũ
   * @returns Promise chứa accessToken và refreshToken mới
   */
  refreshToken(refreshToken: string): Promise<LoginResponseDto>
}

export const IAuthService = Symbol('IAuthService')
