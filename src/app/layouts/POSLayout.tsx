import { Outlet, Link } from 'react-router';
import { ArrowLeft, User, Clock, LogOut } from 'lucide-react';

export default function POSLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* POS Header */}
      <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Kembali</span>
          </Link>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="text-white font-semibold">Point of Sale</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Shift Info */}
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Clock className="w-4 h-4" />
            <span>Shift: 08:00 - 16:00</span>
          </div>

          {/* Cashier Info */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
            <User className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-white font-medium">Kasir 01</span>
          </div>

          {/* Logout */}
          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* POS Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
