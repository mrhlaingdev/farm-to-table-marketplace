'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';

interface ProductPayload {
  title: string;
  price: number;
  unit: string;
  stock: number;
  season?: string | null;
  description?: string | null;
}

async function getFarmerId() {
  let farmer = await prisma.user.findFirst({
    where: { role: 'FARMER' },
    orderBy: { createdAt: 'asc' },
  });

  if (!farmer) {
    farmer = await prisma.user.create({
      data: {
        email: 'admin@shanfresh.local',
        name: 'Shan Fresh Organics',
        role: 'FARMER',
      },
    });
  }

  return farmer.id;
}

function parseProductPayload(formData: FormData): ProductPayload {
  const title = String(formData.get('title') ?? '').trim();
  const price = Number(formData.get('price'));
  const unit = String(formData.get('unit') ?? '').trim();
  const stock = Number(formData.get('stock'));
  const season = String(formData.get('season') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim() || null;

  if (!title || !unit || Number.isNaN(price) || Number.isNaN(stock)) {
    throw new Error('Please provide valid product details.');
  }

  return {
    title,
    price,
    unit,
    stock,
    season,
    description,
  };
}

export async function createProduct(formData: FormData) {
  const payload = parseProductPayload(formData);
  const product = await prisma.product.create({
    data: {
      title: payload.title,
      price: payload.price,
      unit: payload.unit,
      stock: payload.stock,
      season: payload.season ?? undefined,
      description: payload.description ?? '',
      farmerId: await getFarmerId(),
    },
  });

  revalidatePath('/admin');
  return { product };
}

export async function updateProductStock(id: string, delta: number) {
  const current = await prisma.product.findUnique({ where: { id } });

  if (!current) {
    throw new Error('Product not found.');
  }

  const nextStock = Math.max(0, current.stock + delta);
  const product = await prisma.product.update({
    where: { id },
    data: { stock: nextStock },
  });

  revalidatePath('/admin');
  return { product };
}

export async function updateProduct(id: string, formData: FormData) {
  const payload = parseProductPayload(formData);
  const product = await prisma.product.update({
    where: { id },
    data: {
      title: payload.title,
      price: payload.price,
      unit: payload.unit,
      stock: payload.stock,
      season: payload.season ?? undefined,
      description: payload.description ?? undefined,
    },
  });

  revalidatePath('/admin');
  return { product };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  return { id };
}
