export enum ERROR_CODES {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_ACCOUNT_SUSPENDED = 'AUTH_ACCOUNT_SUSPENDED',
  AUTH_ACCOUNT_BANNED = 'AUTH_ACCOUNT_BANNED',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_TWO_FACTOR_REQUIRED = 'AUTH_TWO_FACTOR_REQUIRED',
  AUTH_TWO_FACTOR_INVALID = 'AUTH_TWO_FACTOR_INVALID',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  RBAC_INSUFFICIENT_ROLE = 'RBAC_INSUFFICIENT_ROLE',
  RBAC_INSUFFICIENT_PERMISSION = 'RBAC_INSUFFICIENT_PERMISSION',
  RBAC_NOT_MEMBER = 'RBAC_NOT_MEMBER',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  BILLING_PLAN_LIMIT = 'BILLING_PLAN_LIMIT',
  BILLING_PAYMENT_REQUIRED = 'BILLING_PAYMENT_REQUIRED',
  SYSTEM_INTERNAL_ERROR = 'SYSTEM_INTERNAL_ERROR',
  SYSTEM_SERVICE_UNAVAILABLE = 'SYSTEM_SERVICE_UNAVAILABLE',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ERROR_CODES;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    code: ERROR_CODES,
    message: string,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, ERROR_CODES.VALIDATION_FAILED, message, true, details);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(401, ERROR_CODES.AUTH_INVALID_TOKEN, message, true);
  }

  static forbidden(message = 'Forbidden', code = ERROR_CODES.RBAC_INSUFFICIENT_PERMISSION): AppError {
    return new AppError(403, code as ERROR_CODES, message, true);
  }

  static notFound(resource = 'Resource'): AppError {
    return new AppError(404, ERROR_CODES.RESOURCE_NOT_FOUND, `${resource} not found`, true);
  }

  static conflict(message = 'Conflict'): AppError {
    return new AppError(409, ERROR_CODES.RESOURCE_CONFLICT, message, true);
  }

  static tooManyRequests(message = 'Too many requests'): AppError {
    return new AppError(429, ERROR_CODES.RATE_LIMIT_EXCEEDED, message, true);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, ERROR_CODES.SYSTEM_INTERNAL_ERROR, message, false);
  }
}
