export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct, deleteProduct, updateProduct, updateProductStock } from './actions';
import { prisma } from '../../lib/prisma';

export default async function AdminPage() {
  let products: Array<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    unit: string;
    stock: number;
    season: string | null;
    farmer?: { name?: string | null } | null;
  }> = [];

  try {
    const fetchedProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { farmer: true },
    });

    products = fetchedProducts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      season: product.season,
      farmer: product.farmer,
    }));
  } catch {
    products = [];
  }

  const handleCreate = async (formData: FormData) => {
    'use server';
    await createProduct(formData);
    revalidatePath('/admin');
    redirect('/admin');
  };

  const handleUpdateStock = async (formData: FormData) => {
    'use server';
    const id = String(formData.get('id') ?? '');
    const delta = Number(formData.get('delta') ?? 0);

    if (id) {
      await updateProductStock(id, delta);
      revalidatePath('/admin');
      redirect('/admin');
    }
  };

  const handleUpdate = async (formData: FormData) => {
    'use server';
    const id = String(formData.get('id') ?? '');

    if (id) {
      await updateProduct(id, formData);
      revalidatePath('/admin');
      redirect('/admin');
    }
  };

  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = String(formData.get('id') ?? '');

    if (id) {
      await deleteProduct(id);
      revalidatePath('/admin');
      redirect('/admin');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Farm Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage your harvest inventory
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Add new products, adjust stock quickly, and update listings from one place.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Products</h2>
                <p className="text-sm text-slate-500">Current inventory for your farm</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {products.length} items
              </span>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <article key={product.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{product.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{product.description}</p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {product.stock} in stock
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">${product.price} / {product.unit}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Season: {product.season || 'All-Year'}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Farm: {product.farmer?.name || 'Farm'}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <form action={handleUpdateStock}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="delta" value={-10} />
                      <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        -10 stock
                      </button>
                    </form>
                    <form action={handleUpdateStock}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="delta" value={10} />
                      <button className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50">
                        +10 stock
                      </button>
                    </form>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={product.id} />
                      <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                        Delete
                      </button>
                    </form>
                  </div>

                  <form action={handleUpdate} className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <input type="hidden" name="id" value={product.id} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                        <input name="title" defaultValue={product.title} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Price</label>
                        <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</label>
                        <input name="unit" defaultValue={product.unit} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stock</label>
                        <input name="stock" type="number" defaultValue={product.stock} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Season</label>
                        <input name="season" defaultValue={product.season || ''} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                      <textarea name="description" rows={3} defaultValue={product.description || ''} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    </div>

                    <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Save changes
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add new product</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new listing for your farm</p>

            <form action={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input name="title" required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-emerald-500" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                  <input name="price" type="number" step="0.01" required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Unit</label>
                  <input name="unit" required placeholder="kg / box / lb" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                  <input name="stock" type="number" required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Season</label>
                  <input name="season" placeholder="Summer" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" />
              </div>

              <button className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700">
                Add Product
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
