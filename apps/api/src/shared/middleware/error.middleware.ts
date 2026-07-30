import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ERROR_CODES } from '../errors/app-error';
import { Prisma } from '@prisma/client';
import { env } from '../../config/env';

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code: string = ERROR_CODES.SYSTEM_INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  let details: unknown = undefined;

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      code = ERROR_CODES.RESOURCE_ALREADY_EXISTS;
      message = 'Resource already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      code = ERROR_CODES.RESOURCE_NOT_FOUND;
      message = 'Resource not found';
    } else if (err.code === 'P2003') {
      statusCode = 400;
      code = ERROR_CODES.VALIDATION_FAILED;
      message = 'Foreign key constraint failed';
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_FAILED;
    message = 'Validation failed';
    details = err.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
  }

  // Log non-operational errors
  if (!(err instanceof AppError && err.isOperational)) {
    console.error('Unhandled error:', err);
    // Asynchronously log to database/external service in real app
  }

  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error'; // Hide real message in prod
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Catch-all 404 handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(AppError.notFound('Route'));
};
