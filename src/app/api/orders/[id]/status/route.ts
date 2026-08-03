import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status as OrderStatus;

  if (!Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ order });
}
