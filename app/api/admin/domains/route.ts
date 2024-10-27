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

    const domains = await prisma.allowedDomain.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Failed to fetch domains:', error);
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
    const { domain } = body;

    const allowedDomain = await prisma.allowedDomain.create({
      data: { domain },
    });

    return NextResponse.json(allowedDomain);
  } catch (error) {
    console.error('Failed to create domain:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}