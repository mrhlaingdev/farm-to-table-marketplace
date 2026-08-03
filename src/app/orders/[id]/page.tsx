import { prisma } from '../../../lib/prisma';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { TrackingControls } from './tracking-controls';

const statusSteps = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Order Placed',
  PROCESSING: 'Confirmed',
  SHIPPED: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const statusDescriptions: Record<OrderStatus, string> = {
  PENDING: 'Your order has been received and is being prepared for dispatch.',
  PROCESSING: 'The farm has confirmed your order and packed it for pickup.',
  SHIPPED: 'Your order is on the way and should reach you soon.',
  DELIVERED: 'The delivery has been completed successfully.',
  CANCELLED: 'This order was cancelled and will not be delivered.',
};

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: true,
      items: {
        include: {
          product: {
            include: {
              farmer: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    order = {
      id,
      buyerId: 'demo-buyer',
      status: 'PROCESSING' as OrderStatus,
      totalAmount: 24.5,
      createdAt: new Date(),
      updatedAt: new Date(),
      buyer: {
        id: 'demo-buyer',
        email: 'buyer@farm2table.com',
        name: 'Demo Buyer',
        role: 'BUYER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      items: [
        {
          id: 'demo-item-1',
          orderId: id,
          productId: 'demo-product',
          quantity: 2,
          price: 12.25,
          product: {
            id: 'demo-product',
            title: 'Organic Heirloom Tomatoes',
            description: 'Freshly harvested tomatoes from our farm.',
            price: 12.25,
            unit: 'kg',
            stock: 120,
            season: 'Monsoon',
            farmerId: 'demo-farmer',
            createdAt: new Date(),
            updatedAt: new Date(),
            farmer: {
              id: 'demo-farmer',
              email: 'farmer@farm2table.com',
              name: 'Shan Fresh Organics',
              role: 'FARMER',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      ],
    };
  }

  const currentStepIndex = statusSteps.indexOf(order.status as (typeof statusSteps)[number]);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Delivery Tracking
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Follow your farm-fresh shipment from checkout to doorstep.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Back to Home
            </Link>
            <Link href="/orders/demo" className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Open demo tracking
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Live status flow</h2>
                <p className="mt-1 text-sm text-slate-500">{statusDescriptions[order.status]}</p>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {statusLabels[order.status]}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  return (
                    <div key={step} className="rounded-xl border p-3 text-sm">
                      <div className={`mb-2 h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                      <p className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                        {statusLabels[step as OrderStatus]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Order summary</h3>
              <div className="mt-3 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-800">{item.product.title}</p>
                      <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Delivery details</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-700">Delivery address</dt>
                  <dd className="mt-1">No. 12, Pine Street, Yangon</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Estimated delivery</dt>
                  <dd className="mt-1">Today • 4:30 PM</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Farm origin</dt>
                  <dd className="mt-1">{order.items[0]?.product.farmer.name || 'Local Farm'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Buyer</dt>
                  <dd className="mt-1">{order.buyer.name || order.buyer.email}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Update status</h2>
              <p className="mt-1 text-sm text-slate-500">Simulate the next milestone in delivery.</p>
              <TrackingControls orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
