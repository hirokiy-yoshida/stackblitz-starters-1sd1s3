import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string()
    .min(1, '名前を入力してください')
    .max(50, '名前は50文字以内で入力してください')
    .regex(/^[^\s]+(\s+[^\s]+)*$/, '名前の前後に空白を入れることはできません'),
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスが長すぎます'),
  password: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(100, 'パスワードが長すぎます')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'パスワードには大文字、小文字、数字を含める必要があります'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export type SignupForm = z.infer<typeof signupSchema>;

export const signupApiSchema = signupSchema.omit({ confirmPassword: true });