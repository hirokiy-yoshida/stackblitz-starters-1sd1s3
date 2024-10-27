import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const shops = await prisma.shop.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Failed to fetch shops:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, openTime, closeTime } = body;

    const shop = await prisma.shop.create({
      data: {
        name,
        openTime,
        closeTime,
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.error('Failed to create shop:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}