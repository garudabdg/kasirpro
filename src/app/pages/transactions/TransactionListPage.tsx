import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Receipt, Eye, X, Printer, Edit } from 'lucide-react';
import { Link } from 'react-router';

export default function TransactionListPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewTransaction, setViewTransaction] = useState<any>(null);
  const [editTransaction, setEditTransaction] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    created_at: '',
    payment_method: '',
    status: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (tx: any) => {
    const date = new Date(tx.created_at);
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    
    setEditForm({
      created_at: localISOTime,
      payment_method: tx.payment_method || 'cash',
      status: tx.status || 'completed',
    });
    setEditTransaction(tx);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/transactions/${editTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          created_at: new Date(editForm.created_at).toISOString(),
          payment_method: editForm.payment_method,
          status: editForm.status
        })
      });

      if (response.ok) {
        alert('Transaksi berhasil diperbarui');
        setEditTransaction(null);
        fetchTransactions();
      } else {
        alert('Gagal memperbarui transaksi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h1>
          <p className="text-gray-600 mt-1 text-sm">Kelola riwayat transaksi penjualan Anda</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl flex-1 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6">Invoice</th>
                <th className="py-4 px-6">Waktu</th>
                <th className="py-4 px-6">Metode</th>
                <th className="py-4 px-6 text-right">Total</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <div className="animate-pulse">Memuat data transaksi...</div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Tidak ada transaksi ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-medium text-blue-600">{tx.invoice_number}</span>
                      <div className="text-xs text-gray-500 mt-1">{tx.items?.length || 0} items</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(tx.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                        {tx.payment_method}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">
                      Rp {Number(tx.grand_total).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'voided' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setViewTransaction(tx)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(tx)}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit Transaksi"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <Link 
                          to={`/transactions/${tx.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Cetak Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* View Transaction Modal */}
      {viewTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detail Transaksi</h3>
                <p className="text-sm font-mono text-gray-500 mt-1">{viewTransaction.invoice_number}</p>
              </div>
              <button 
                onClick={() => setViewTransaction(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                  <p className="font-medium text-gray-900">
                    {new Date(viewTransaction.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium text-gray-900 capitalize">{viewTransaction.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewTransaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {viewTransaction.status}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2 px-4 font-medium">Item</th>
                      <th className="py-2 px-4 font-medium text-center">Qty</th>
                      <th className="py-2 px-4 font-medium text-right">Harga</th>
                      <th className="py-2 px-4 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewTransaction.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 text-gray-900">Produk ID: {item.product_id.split('-')[0]}...</td>
                        <td className="py-2 px-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="py-2 px-4 text-right text-gray-600">Rp {Number(item.unit_price).toLocaleString('id-ID')}</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {Number(viewTransaction.subtotal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pajak (PPN)</span>
                  <span>Rp {Number(viewTransaction.tax_total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>Rp {Number(viewTransaction.grand_total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-2">
                  <span>Tunai / Dibayar</span>
                  <span>Rp {Number(viewTransaction.paid_amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kembalian</span>
                  <span>Rp {Number(viewTransaction.change_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setViewTransaction(null)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <Link 
                to={`/transactions/${viewTransaction.id}`}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Invoice
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Transaksi {editTransaction.invoice_number}</h3>
              <button 
                onClick={() => setEditTransaction(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Jam</label>
                <input 
                  type="datetime-local" 
                  value={editForm.created_at}
                  onChange={(e) => setEditForm({...editForm, created_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select 
                  value={editForm.payment_method}
                  onChange={(e) => setEditForm({...editForm, payment_method: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Tunai</option>
                  <option value="debit">Debit/Kredit</option>
                  <option value="qris">QRIS</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="completed">Selesai (Completed)</option>
                  <option value="voided">Dibatalkan (Voided)</option>
                  <option value="pending">Tertunda (Pending)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditTransaction(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
