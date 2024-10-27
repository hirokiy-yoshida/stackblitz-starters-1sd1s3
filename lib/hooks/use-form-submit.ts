import { useCallback } from 'react';
import { useAsync } from './use-async';
import { ApiError } from '@/lib/api-response';

interface UseFormSubmitOptions<T, R> {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  transform?: (data: T) => any;
}

export function useFormSubmit<T = any, R = any>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  transform,
}: UseFormSubmitOptions<T, R> = {}) {
  const { execute, loading } = useAsync<R>({
    onSuccess,
    onError,
    successMessage,
    errorMessage,
  });

  const handleSubmit = useCallback(
    async (url: string, data: T, method: string = 'POST') => {
      const body = transform ? transform(data) : data;

      return execute(async () => {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new ApiError(
            result.error?.code || 'UNKNOWN_ERROR',
            result.error?.message || 'An error occurred',
            response.status
          );
        }

        return result.data;
      });
    },
    [execute, transform]
  );

  return {
    handleSubmit,
    loading,
  };
}