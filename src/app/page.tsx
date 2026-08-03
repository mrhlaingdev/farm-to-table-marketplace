import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center px-8 py-5 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
          🌱 <span>Farm2Table</span>
        </div>
        <nav className="flex items-center gap-6 font-medium text-slate-600">
          <Link href="#features" className="hover:text-emerald-600 transition">Features</Link>
          <Link href="#products" className="hover:text-emerald-600 transition">Products</Link>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition">
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4">
          Directly from Local Organic Farmers 🚜
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Fresh Organic Produce for <br className="hidden sm:inline" />
          <span className="text-emerald-600">Restaurants & Bulk Buyers</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Eliminate middlemen, reduce supply chain friction, and get farm-fresh ingredients delivered straight to your kitchen with full transparency.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition">
            Browse Market
          </a>
          <a href="#features" className="border border-slate-300 hover:bg-slate-100 font-medium px-6 py-3 rounded-xl transition">
            Learn More
          </a>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-3xl mb-4">🌽</div>
          <h3 className="text-xl font-bold mb-2">Seasonal Produce</h3>
          <p className="text-slate-600 text-sm">Filter and source fresh crops directly based on local harvesting seasons.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-3xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">Bulk Orders</h3>
          <p className="text-slate-600 text-sm">Tailored pricing and inventory capacities for commercial kitchens & restaurants.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-3xl mb-4">🚚</div>
          <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
          <p className="text-slate-600 text-sm">Transparent delivery flow status from dispatch at the farm to your doorstep.</p>
        </div>
      </section>
    </div>
  );
}
