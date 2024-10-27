import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsync<T = void>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
}: UseAsyncOptions<T> = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>) => {
      try {
        setLoading(true);
        setError(null);
        const data = await asyncFunction();
        
        if (successMessage) {
          toast.success(successMessage);
        }
        
        onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        
        if (errorMessage) {
          toast.error(errorMessage);
        } else if (error.message) {
          toast.error(error.message);
        }
        
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, successMessage, errorMessage]
  );

  return {
    loading,
    error,
    execute,
  };
}