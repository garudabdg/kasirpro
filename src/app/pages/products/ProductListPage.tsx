import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Package,
  Tag,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

export default function ProductListPage() {
  const { products, fetchProducts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewProduct, setViewProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= 20).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600 mt-1">Kelola produk dan inventori</p>
        </div>
        <Link
          to="/products/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Produk', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kategori Aktif', value: 4, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Best Seller', value: 'Indomie', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Stok Menipis', value: lowStockCount, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk berdasarkan nama atau SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="food">Makanan</option>
            <option value="drink">Minuman</option>
            <option value="household">Kebutuhan Rumah</option>
            <option value="snack">Snack</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden lg:inline">Filter</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden lg:inline">Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">No</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Harga</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stok</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-500 text-center">{index + 1}</td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 capitalize">{product.category}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-medium text-gray-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-medium ${product.stock <= 20 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {product.stock > 20 ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Aman
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Stok Menipis
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link 
                        to={`/products/edit/${product.id}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-block"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={async () => {
                          if (window.confirm(`Apakah Anda yakin ingin menghapus produk ${product.name}?`)) {
                            try {
                              const response = await fetch(`http://localhost:3000/api/products/${product.id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                alert('Produk berhasil dihapus!');
                                fetchProducts(); // Refresh tabel
                              } else {
                                alert('Gagal menghapus produk. Silakan coba lagi.');
                              }
                            } catch (error) {
                              console.error('Error deleting product:', error);
                              alert('Terjadi kesalahan saat menghapus produk.');
                            }
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Menampilkan <span className="font-medium text-gray-900">{filteredProducts.length}</span> dari <span className="font-medium text-gray-900">{products.length}</span> produk
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
              Prev
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Detail Produk</h3>
              <button 
                onClick={() => setViewProduct(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{viewProduct.name}</h4>
                  <p className="text-sm font-mono text-gray-500">{viewProduct.sku}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Kategori</p>
                  <p className="font-medium text-gray-900 capitalize">{viewProduct.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Stok Tersedia</p>
                  <p className={`font-medium ${viewProduct.stock <= 20 ? 'text-red-600' : 'text-gray-900'}`}>
                    {viewProduct.stock} unit
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Harga Jual</p>
                  <p className="font-medium text-gray-900">Rp {viewProduct.price?.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${viewProduct.stock > 20 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {viewProduct.stock > 20 ? 'Aman' : 'Stok Menipis'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setViewProduct(null)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
