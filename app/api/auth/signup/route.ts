import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signupApiSchema } from '@/lib/validations/auth';
import { sanitizeInput } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = signupApiSchema.parse({
      ...body,
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email).toLowerCase(),
    });

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // Check if email domain is allowed
    const domain = email.split('@')[1];
    const allowedDomain = await prisma.allowedDomain.findUnique({
      where: { domain },
    });

    if (!allowedDomain) {
      return NextResponse.json(
        { message: 'このメールドメインは許可されていません' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: 'ユーザーを作成しました', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: '入力データが正しくありません' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}