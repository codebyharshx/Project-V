import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Unauthorized") {
    super(401, message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Forbidden") {
    super(403, message, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(409, message, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends APIError {
  constructor(retryAfter?: number) {
    super(429, "Rate limit exceeded", "RATE_LIMIT");
    this.retryAfter = retryAfter;
    this.name = "RateLimitError";
  }

  retryAfter?: number;
}

export class ServerError extends APIError {
  constructor(message: string = "Internal server error") {
    super(500, message, "INTERNAL_SERVER_ERROR");
    this.name = "ServerError";
  }
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, unknown>;
  };
}

export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error);
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          code: error.code || "API_ERROR",
          message: error.message,
          statusCode: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Invalid request body",
          statusCode: 400,
        },
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        statusCode: 500,
      },
    },
    { status: 500 }
  );
}

/**
 * Async wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
  data: Record<string, unknown>,
  required: string[]
): void {
  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(", ")}`
    );
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): void {
  if (value.length < minLength || value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`
    );
  }
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`
    );
  }
}
