/**
 * Standard Response Messages
 * Centralized message constants for API responses
 */

export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login berhasil',
  LOGOUT_SUCCESS: 'Logout berhasil',
  REGISTER_SUCCESS: 'Registrasi berhasil',
  PASSWORD_CHANGED: 'Password berhasil diubah',
  
  // CRUD Operations
  CREATE_SUCCESS: 'Data berhasil dibuat',
  UPDATE_SUCCESS: 'Data berhasil diperbarui',
  DELETE_SUCCESS: 'Data berhasil dihapus',
  
  // User Management
  USER_LOCKED: 'User berhasil dikunci',
  USER_UNLOCKED: 'User berhasil dibuka',
  
  // Products
  PRODUCT_CREATED: 'Produk berhasil dibuat',
  PRODUCT_UPDATED: 'Produk berhasil diperbarui',
  PRODUCT_DELETED: 'Produk berhasil dihapus',
  
  // Pages
  PAGE_PUBLISHED: 'Halaman berhasil dipublikasikan',
  PAGE_UNPUBLISHED: 'Halaman berhasil di-unpublish',
  
  // Books
  BOOK_CREATED: 'Buku berhasil ditambahkan',
  BOOK_UPDATED: 'Buku berhasil diperbarui',
  
  // Reports
  REPORT_GENERATED: 'Laporan berhasil dibuat',
  EXPORT_SUCCESS: 'Export berhasil'
}

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Email atau password salah',
  ACCOUNT_LOCKED: 'Akun Anda telah dikunci. Hubungi administrator',
  TOKEN_INVALID: 'Token tidak valid',
  TOKEN_EXPIRED: 'Token telah kadaluarsa',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  FORBIDDEN: 'Akses ditolak',
  
  // Validation
  VALIDATION_ERROR: 'Data yang dikirim tidak valid',
  REQUIRED_FIELD: 'Field wajib diisi',
  INVALID_FORMAT: 'Format data tidak valid',
  
  // Not Found
  NOT_FOUND: 'Data tidak ditemukan',
  USER_NOT_FOUND: 'User tidak ditemukan',
  PRODUCT_NOT_FOUND: 'Produk tidak ditemukan',
  PAGE_NOT_FOUND: 'Halaman tidak ditemukan',
  BOOK_NOT_FOUND: 'Buku tidak ditemukan',
  
  // Conflict
  EMAIL_ALREADY_EXISTS: 'Email sudah terdaftar',
  USERNAME_ALREADY_EXISTS: 'Username sudah digunakan',
  SLUG_ALREADY_EXISTS: 'Slug sudah digunakan',
  
  // Permission
  INSUFFICIENT_PERMISSION: 'Anda tidak memiliki izin untuk aksi ini',
  CANNOT_LOCK_MASTER: 'Master Admin tidak dapat dikunci',
  CANNOT_LOCK_SELF: 'Anda tidak dapat mengunci akun sendiri',
  
  // Server
  INTERNAL_ERROR: 'Terjadi kesalahan server',
  DATABASE_ERROR: 'Terjadi kesalahan database',
  
  // File Upload
  FILE_TOO_LARGE: 'Ukuran file terlalu besar',
  INVALID_FILE_TYPE: 'Tipe file tidak didukung',
  UPLOAD_FAILED: 'Upload file gagal'
}

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Format email tidak valid',
  PASSWORD_MIN_LENGTH: 'Password minimal 8 karakter',
  PASSWORD_MUST_CONTAIN: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
  USERNAME_MIN_LENGTH: 'Username minimal 3 karakter',
  USERNAME_MAX_LENGTH: 'Username maksimal 20 karakter',
  PRICE_MUST_BE_POSITIVE: 'Harga harus lebih dari 0',
  AMOUNT_MUST_BE_POSITIVE: 'Jumlah harus lebih dari 0'
}
