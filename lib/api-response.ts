type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(error: ApiError): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };
}

export const ApiErrors = {
  UNAUTHORIZED: new ApiError('UNAUTHORIZED', '認証が必要です', 401),
  FORBIDDEN: new ApiError('FORBIDDEN', 'アクセス権限がありません', 403),
  NOT_FOUND: new ApiError('NOT_FOUND', 'リソースが見つかりません', 404),
  VALIDATION_ERROR: new ApiError('VALIDATION_ERROR', '入力データが正しくありません', 400),
  CONFLICT: new ApiError('CONFLICT', 'リソースが既に存在します', 409),
  SERVER_ERROR: new ApiError('SERVER_ERROR', 'サーバーエラーが発生しました', 500),
} as const;