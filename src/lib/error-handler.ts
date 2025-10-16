import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized error handling for API routes
 */

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse<ApiError> {
  const errorResponse: ApiError = {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse<ApiError> {
  return createErrorResponse(
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
  );
}

/**
 * Handle authentication errors
 */
export function handleAuthError(
  message: string = 'Authentication required'
): NextResponse<ApiError> {
  return createErrorResponse(message, 401, 'AUTH_ERROR');
}

/**
 * Handle authorization errors
 */
export function handleAuthorizationError(
  message: string = 'Insufficient permissions'
): NextResponse<ApiError> {
  return createErrorResponse(message, 403, 'AUTHORIZATION_ERROR');
}

/**
 * Handle not found errors
 */
export function handleNotFoundError(
  resource: string = 'Resource'
): NextResponse<ApiError> {
  return createErrorResponse(`${resource} not found`, 404, 'NOT_FOUND');
}

/**
 * Handle rate limit errors
 */
export function handleRateLimitError(
  retryAfter?: number
): NextResponse<ApiError> {
  const response = createErrorResponse(
    'Too many requests, please try again later',
    429,
    'RATE_LIMIT_EXCEEDED'
  );

  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }

  return response;
}

/**
 * Handle server errors
 */
export function handleServerError(error: unknown): NextResponse<ApiError> {
  console.error('Server error:', error);

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  return createErrorResponse(
    process.env.NODE_ENV === 'development' ? message : 'Internal server error',
    500,
    'SERVER_ERROR',
    process.env.NODE_ENV === 'development'
      ? { originalError: error }
      : undefined
  );
}

/**
 * Generic error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error);
      }

      return handleServerError(error);
    }
  };
}

/**
 * Success response helper
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}
