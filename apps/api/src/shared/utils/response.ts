import { Response, Request } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static created<T>(res: Response, data: T) {
    return this.success(res, data, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static paginated<T>(res: Response, data: T, meta: { page: number; limit: number; total: number; totalPages: number }) {
    return res.status(200).json({
      success: true,
      data,
      meta,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, error: any) {
    const code = error.code || 'INTERNAL_SERVER_ERROR';
    const message = error.message || 'An unexpected error occurred';
    const details = error.details || undefined;
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      error: { code, message, details },
      timestamp: new Date().toISOString()
    });
  }
}
