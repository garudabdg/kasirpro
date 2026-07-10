import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Printer, ArrowLeft, Building2, MapPin, Phone, Mail } from 'lucide-react';
import LogoImage from '../../../images-logo.png';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/transactions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTransaction(data);
      }
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500 font-medium">Memuat data invoice...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaksi Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Maaf, data transaksi yang Anda cari tidak tersedia.</p>
        <Link to="/transactions" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Kembali ke Daftar Transaksi
        </Link>
      </div>
    );
  }

  const store = transaction.store || {};
  const merchant = store.merchant || {};

  return (
    <div className="flex flex-col h-full bg-gray-50 print:bg-white print:block print:h-auto overflow-y-auto print:overflow-visible">
      {/* Top Action Bar - Hidden on Print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Link 
            to="/transactions"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {transaction.invoice_number}</h1>
            <p className="text-gray-500 text-sm mt-1">Pratinjau dokumen invoice</p>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
        >
          <Printer className="w-5 h-5" />
          Cetak Dokumen
        </button>
      </div>

      {/* Invoice Container (A4 Proportions) */}
      <div className="flex-1 flex justify-center pb-12 print:pb-0">
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-12 shadow-lg rounded-2xl print:shadow-none print:rounded-none print:p-0">
          
          {/* Header Section */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 shrink-0">
                <img src={LogoImage} alt="Revantine Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                  Revantine
                </h2>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  {store.address && (
                    <div className="flex items-start gap-2 max-w-xs">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-200 tracking-wider uppercase mb-2">INVOICE</h1>
              <div className="text-gray-900 font-mono font-bold text-lg mb-4">{transaction.invoice_number}</div>
              
              <div className="inline-block bg-gray-50 rounded-lg p-3 text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tanggal Transaksi</div>
                <div className="font-medium text-gray-900">
                  {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(transaction.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ditagihkan Kepada</h3>
              {transaction.customer ? (
                <div>
                  <div className="font-bold text-gray-900 text-lg">{transaction.customer.name}</div>
                  <div className="text-gray-600 mt-1 text-sm">{transaction.customer.phone || '-'}</div>
                  {transaction.customer.address && <div className="text-gray-600 text-sm mt-1">{transaction.customer.address}</div>}
                </div>
              ) : (
                <div className="text-gray-500 italic">Pelanggan Umum (Walk-in)</div>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detail Pembayaran</h3>
              <div className="text-gray-900 font-medium capitalize">{transaction.payment_method || 'Cash'}</div>
              <div className="text-gray-500 text-sm mt-1">
                Status: <span className="font-semibold text-green-600 uppercase tracking-wider">{transaction.status || 'Lunas'}</span>
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Kasir: <span className="text-gray-900">{transaction.user?.name || '-'}</span>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-3 text-sm font-bold text-gray-900 uppercase tracking-wider">Deskripsi Item</th>
                  <th className="py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider w-24">Qty</th>
                  <th className="py-3 text-right text-sm font-bold text-gray-900 uppercase tracking-wider w-32">Harga</th>
                  <th className="py-3 text-right text-sm font-bold text-gray-900 uppercase tracking-wider w-40">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transaction.items?.map((item: any, index: number) => (
                  <tr key={item.id || index}>
                    <td className="py-4">
                      <div className="font-semibold text-gray-900">{item.product?.name || 'Produk Tidak Diketahui'}</div>
                      {item.product?.sku && <div className="text-xs text-gray-500 font-mono mt-1">SKU: {item.product.sku}</div>}
                    </td>
                    <td className="py-4 text-center text-gray-700 font-medium">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-700">Rp {Number(item.unit_price).toLocaleString('id-ID')}</td>
                    <td className="py-4 text-right font-bold text-gray-900">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-16">
            <div className="w-full max-w-sm">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rp {Number(transaction.subtotal).toLocaleString('id-ID')}</span>
                </div>
                {Number(transaction.discount_total) > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Diskon</span>
                    <span>- Rp {Number(transaction.discount_total).toLocaleString('id-ID')}</span>
                  </div>
                )}
                {Number(transaction.tax_total) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Pajak (PPN)</span>
                    <span className="font-medium text-gray-900">Rp {Number(transaction.tax_total).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-4 border-t-2 border-gray-900 border-b-2 border-gray-100 my-4">
                  <span className="text-lg font-bold text-gray-900">Total Tagihan</span>
                  <span className="text-2xl font-black text-indigo-600">Rp {Number(transaction.grand_total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dibayar</span>
                  <span className="font-medium text-gray-900">Rp {Number(transaction.paid_amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kembalian</span>
                  <span className="font-medium text-gray-900">Rp {Number(transaction.change_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-900 mb-1">Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</p>
            <div className="mt-4 text-xs">
              Dicetak pada {new Date().toLocaleString('id-ID')}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

