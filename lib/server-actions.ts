import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ApiError, ApiErrors } from '@/lib/api-response';

export async function revalidateData(path: string = '/') {
  revalidatePath(path);
}

export async function checkAdminAccess(session: any) {
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw ApiErrors.FORBIDDEN;
  }
}

export async function checkShopManagerAccess(session: any) {
  if (!session?.user || session.user.role !== 'SHOP_MANAGER') {
    throw ApiErrors.FORBIDDEN;
  }
}

export async function validateShopAccess(session: any, shopId: string) {
  if (!session?.user) throw ApiErrors.UNAUTHORIZED;
  
  if (session.user.role === 'ADMIN') return;
  
  if (session.user.role === 'SHOP_MANAGER' && session.user.shopId !== shopId) {
    throw ApiErrors.FORBIDDEN;
  }
}

export async function getShopById(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) throw ApiErrors.NOT_FOUND;
  return shop;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw ApiErrors.NOT_FOUND;
  return user;
}