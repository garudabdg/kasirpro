import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  Store,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SuperAdminDashboard() {
  // Mock data
  const salesData = [
    { month: 'Jan', sales: 4500000 },
    { month: 'Feb', sales: 5200000 },
    { month: 'Mar', sales: 4800000 },
    { month: 'Apr', sales: 6100000 },
    { month: 'May', sales: 7200000 },
    { month: 'Jun', sales: 6800000 },
  ];

  const categoryData = [
    { name: 'Makanan', value: 35 },
    { name: 'Minuman', value: 25 },
    { name: 'Elektronik', value: 20 },
    { name: 'Fashion', value: 15 },
    { name: 'Lainnya', value: 5 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const topProducts = [
    { id: 1, name: 'Indomie Goreng', sales: 1250, revenue: 6250000, change: 12 },
    { id: 2, name: 'Aqua 600ml', sales: 980, revenue: 2940000, change: 8 },
    { id: 3, name: 'Beras Premium 5kg', sales: 450, revenue: 27000000, change: -3 },
    { id: 4, name: 'Minyak Goreng 2L', sales: 680, revenue: 27200000, change: 15 },
    { id: 5, name: 'Gula Pasir 1kg', sales: 720, revenue: 10080000, change: 5 },
  ];

  const lowStockItems = [
    { id: 1, name: 'Susu UHT Coklat', stock: 12, minStock: 50 },
    { id: 2, name: 'Kopi Sachet', stock: 25, minStock: 100 },
    { id: 3, name: 'Shampo Botol', stock: 8, minStock: 30 },
    { id: 4, name: 'Sabun Mandi', stock: 15, minStock: 40 },
  ];

  const storePerformance = [
    { name: 'Toko Pusat', revenue: 125000000, transactions: 1250, growth: 12 },
    { name: 'Cabang Timur', revenue: 98000000, transactions: 890, growth: 8 },
    { name: 'Cabang Barat', revenue: 87000000, transactions: 780, growth: -2 },
    { name: 'Cabang Utara', revenue: 76000000, transactions: 650, growth: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Super Admin</h1>
        <p className="text-gray-600 mt-1">Ringkasan performa semua toko</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                Rp 386 Juta
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+12.5%</span>
                <span className="text-sm text-gray-500">vs bulan lalu</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3,570</h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+8.2%</span>
                <span className="text-sm text-gray-500">vs bulan lalu</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customer</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+15.3%</span>
                <span className="text-sm text-gray-500">member baru</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produk</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2,456</h3>
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600 font-medium">24 stok menipis</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Trend Penjualan</h3>
              <p className="text-sm text-gray-600">6 bulan terakhir</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Semua Toko</option>
              <option>Toko Pusat</option>
              <option>Cabang Timur</option>
              <option>Cabang Barat</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} id="sales-trend-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                formatter={(value: any) => `Rp ${(value / 1000000).toFixed(1)}M`}
              />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Kategori Produk</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart id="category-pie-chart">
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Produk</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} terjual</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rp {(product.revenue / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {product.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        product.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.change > 0 ? '+' : ''}
                      {product.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Stok Menipis</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Min. stok: {item.minStock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {item.stock} pcs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Performa Toko</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Nama Toko
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Transaksi
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Rata-rata
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {storePerformance.map((store, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{store.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    Rp {(store.revenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {store.transactions.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    Rp {Math.round(store.revenue / store.transactions).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {store.growth > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          store.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {store.growth > 0 ? '+' : ''}
                        {store.growth}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
