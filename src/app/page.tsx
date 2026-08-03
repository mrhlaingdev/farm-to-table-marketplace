import { AddToCartBtn } from '../components/AddToCartBtn';
import { prisma } from '../lib/prisma';

interface PageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { season } = await searchParams;

  const products = await prisma.product.findMany({
    where: season ? { season } : {},
    include: { farmer: true },
  });

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-emerald-700">
          Farm2Table Marketplace
        </h1>
        <p className="text-slate-600 mb-8">
          Directly connecting fresh local farms with buyers.
        </p>
        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href="/orders/demo"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View Tracking Demo
          </a>
          <a
            href="/admin"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Open Admin Dashboard
          </a>
        </div>

        {/* Season Filter Buttons */}
        <div className="flex gap-2 mb-8">
          <a
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !season
                ? 'bg-emerald-600 text-white'
                : 'bg-white border text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Seasons
          </a>
          {['Monsoon', 'Winter', 'Summer'].map((s) => (
            <a
              key={s}
              href={`/?season=${s}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                season === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                {product.season} Season
              </div>
              <h2 className="text-lg font-bold mb-1">{product.title}</h2>
              <p className="text-xs text-slate-500 mb-3">
                Farm: {product.farmer?.name || 'Local Farm'}
              </p>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-lg font-bold text-slate-900">
                  ${product.price} / {product.unit}
                </span>
                <span className="text-xs text-slate-500">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="mt-4">
                <AddToCartBtn
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    unit: product.unit,
                    description: product.description,
                    season: product.season,
                    farmer: product.farmer,
                    stock: product.stock,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}