'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { signupSchema, type SignupForm } from '@/lib/validations/auth';
import { Input } from '@/components/ui/Input';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '登録に失敗しました');
      }

      // 自動ログイン
      const signInResult = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('ログインに失敗しました');
      }

      toast.success('アカウントを作成しました');
      router.push('/calendar');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="名前"
        id="name"
        type="text"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="メールアドレス"
        id="email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="パスワード"
        id="password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="パスワード（確認）"
        id="confirmPassword"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '作成中...' : 'アカウントを作成'}
      </button>

      <p className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちですか？{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </p>
    </form>
  );
}