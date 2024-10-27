import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, openTime, closeTime } = body;

    const shop = await prisma.shop.update({
      where: { id: params.id },
      data: {
        name,
        openTime,
        closeTime,
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.error('Failed to update shop:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}