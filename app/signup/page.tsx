import { SignupForm } from '@/components/forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">アカウント作成</h1>
        <SignupForm />
      </div>
    </div>
  );
}