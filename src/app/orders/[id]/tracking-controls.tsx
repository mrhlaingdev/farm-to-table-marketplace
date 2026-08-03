'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OrderStatus } from '@prisma/client';

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'PENDING', label: 'Order Placed' },
  { value: 'PROCESSING', label: 'Confirmed' },
  { value: 'SHIPPED', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export function TrackingControls({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as OrderStatus;
    setStatus(nextStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Unable to update status');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <label className="block text-sm font-medium text-slate-700" htmlFor="status-select">
        Delivery status
      </label>
      <select
        id="status-select"
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-sm text-slate-500">
        {isUpdating ? 'Updating delivery status...' : 'Select a status to simulate a live tracking update.'}
      </p>
    </div>
  );
}
