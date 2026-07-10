import { Outlet, Link, useLocation } from 'react-router';
import { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Receipt,
  Users,
  Truck,
  ShoppingBag,
  FileText,
  DollarSign,
  Clock,
  UserCog,
  Store,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from 'lucide-react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Point of Sale', path: '/pos' },
    {
      icon: Package,
      label: 'Produk',
      path: '/products',
      children: [
        { label: 'Daftar Produk', path: '/products' },
        { label: 'Tambah Produk', path: '/products/create' },
      ],
    },
    {
      icon: Warehouse,
      label: 'Inventory',
      path: '/inventory',
      children: [
        { label: 'Stok Barang', path: '/inventory' },
        { label: 'Stok Opname', path: '/inventory/opname' },
      ],
    },
    { icon: Receipt, label: 'Transaksi', path: '/transactions' },
    { icon: Users, label: 'Customer', path: '/customers' },
    { icon: Truck, label: 'Supplier', path: '/suppliers' },
    {
      icon: ShoppingBag,
      label: 'Purchase Order',
      path: '/purchase-orders',
      children: [
        { label: 'Daftar PO', path: '/purchase-orders' },
        { label: 'Buat PO', path: '/purchase-orders/create' },
      ],
    },
    {
      icon: FileText,
      label: 'Laporan',
      path: '/reports',
      children: [
        { label: 'Laporan Penjualan', path: '/reports/sales' },
        { label: 'Laporan Inventory', path: '/reports/inventory' },
        { label: 'Laporan Keuangan', path: '/reports/financial' },
      ],
    },
    {
      icon: Clock,
      label: 'Shift',
      path: '/shifts',
      children: [
        { label: 'Buka Shift', path: '/shifts/open' },
        { label: 'Tutup Shift', path: '/shifts/close' },
      ],
    },
    { icon: UserCog, label: 'User Management', path: '/users' },
    { icon: Store, label: 'Kelola Toko', path: '/stores' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col print:hidden`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">KasirPro</span>
            </div>
          ) : (
            <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.children ? (
                  <div>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </div>
                    {sidebarOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`block px-3 py-2 text-sm rounded-lg ${
                                isActive(child.path)
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-200 hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 print:hidden">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk, transaksi, customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Store Selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <Store className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Toko Pusat</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Admin Toko</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </Link>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 print:p-0 print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
