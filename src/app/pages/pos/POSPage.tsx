import { useState, useEffect } from 'react';
import {
  Scan,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Tag,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  Clock,
  X,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useStore, Product } from '../../../store/useStore';

export default function POSPage() {
  const {
    products,
    cart,
    addToCart,
    updateQty,
    removeItem,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    clearCart,
    fetchProducts,
  } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'debit' | 'qris' | 'ewallet' | null>(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'food', name: 'Makanan' },
    { id: 'drink', name: 'Minuman' },
    { id: 'snack', name: 'Snack' },
    { id: 'household', name: 'Kebutuhan Rumah' },
  ];

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();
  const amountPaid = parseFloat(paymentAmount) || 0;
  const change = amountPaid > total ? amountPaid - total : 0;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const simulateScan = () => {
    if (filteredProducts.length > 0) {
      const randomProduct = filteredProducts[Math.floor(Math.random() * filteredProducts.length)];
      addToCart(randomProduct);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === 'cash' && amountPaid < total) {
      alert('Uang tunai kurang!');
      return;
    }
    setShowPayment(false);
    setShowReceiptPreview(true);
  };

  const finishTransaction = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          paymentMethod,
          paymentAmount: parseFloat(paymentAmount.toString() || '0'),
          subtotal,
          discount: 0,
          tax: tax,
          grandTotal: total
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan transaksi');
      }

      window.print();
      // Beri sedikit jeda agar dialog print muncul sebelum state direset
      setTimeout(() => {
        clearCart();
        setShowReceiptPreview(false);
        setPaymentAmount('');
        setPaymentMethod(null);
      }, 1000);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Terjadi kesalahan saat menyimpan transaksi. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Left Panel - Products */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col h-full">
        {/* Search & Scan */}
        <div className="flex gap-3 mb-6 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau scan barcode..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button 
            onClick={simulateScan}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white flex items-center gap-2 font-medium transition-colors"
          >
            <Scan className="w-5 h-5" />
            <span className="hidden md:inline">Scan</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-max overflow-y-auto pr-2 pb-6 flex-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white hover:bg-gray-50 rounded-2xl p-4 text-left transition-colors border border-gray-200 flex flex-col shadow-sm group"
            >
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center w-full group-hover:bg-gray-200 transition-colors">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium text-sm mb-1 line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <div className="mt-auto pt-3 flex justify-between items-end">
                <p className="text-blue-600 font-bold">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-500 text-xs font-medium">
                  Stok: {product.stock}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-lg relative z-10 shrink-0">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              Keranjang
            </h2>
            <div className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.qty, 0)} Items
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 text-sm flex items-center justify-between border border-gray-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Customer Umum</p>
                <p className="text-xs text-gray-500">Walk-in Customer</p>
              </div>
            </div>
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Keranjang masih kosong</p>
              <p className="text-gray-400 text-sm mt-1">Scan produk atau pilih dari daftar</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="text-gray-900 font-medium text-sm leading-tight">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-1">{item.sku}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-gray-900 font-medium text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-bold text-[15px]">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-500 text-[11px] font-medium">
                      @Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 shrink-0 relative z-20">
          {/* Discount Button */}
          <button className="w-full px-4 py-3 mb-5 bg-white hover:bg-gray-100 rounded-xl text-gray-700 text-sm flex items-center justify-between border border-gray-200 transition-colors">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Tambah Diskon/Voucher</span>
            </div>
            <Plus className="w-4 h-4 text-gray-400" />
          </button>

          {/* Summary */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-600 text-sm font-medium">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm font-medium">
              <span>Pajak (PPN 11%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-900 text-xl font-bold pt-3 border-t border-gray-200">
              <span>Total</span>
              <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              className="col-span-1 py-3.5 bg-white hover:bg-gray-100 rounded-xl text-gray-700 flex flex-col items-center justify-center gap-1 border border-gray-200 font-medium transition-colors"
            >
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-xs">Hold</span>
            </button>
            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="col-span-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-base"
            >
              <CreditCard className="w-5 h-5" />
              <span>Bayar (Rp {total.toLocaleString('id-ID')})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-4xl flex overflow-hidden shadow-2xl">
            {/* Left Side - Payment Methods */}
            <div className="w-1/2 p-8 border-r border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Metode Pembayaran</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'cash', icon: Banknote, label: 'Tunai', color: 'text-green-600' },
                  { id: 'debit', icon: CreditCard, label: 'Debit/Kredit', color: 'text-blue-600' },
                  { id: 'qris', icon: QrCode, label: 'QRIS', color: 'text-purple-600' },
                  { id: 'ewallet', icon: Smartphone, label: 'E-Wallet', color: 'text-orange-600' },
                ].map((method) => (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-6 rounded-2xl flex flex-col items-center gap-4 transition-all border ${
                      paymentMethod === method.id 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <method.icon className={`w-12 h-12 ${paymentMethod === method.id ? 'text-blue-600' : method.color}`} />
                    <span className={`font-semibold ${paymentMethod === method.id ? 'text-blue-700' : 'text-gray-700'}`}>
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Payment Details */}
            <div className="w-1/2 bg-gray-50 p-8 flex flex-col">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium mb-1">Total Tagihan</p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
                  Rp {total.toLocaleString('id-ID')}
                </p>

                {paymentMethod === 'cash' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-700 text-sm font-medium mb-2 block">Uang Diterima</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                        <input 
                          type="number" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Quick Cash Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      {[total, 50000, 100000, 150000, 200000].map((amt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setPaymentAmount(amt.toString())}
                          className="py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm transition-colors shadow-sm"
                        >
                          {idx === 0 ? 'Uang Pas' : `Rp ${(amt/1000).toFixed(0)}k`}
                        </button>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Kembalian</span>
                        <span className={`text-2xl font-bold ${change > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          Rp {change.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : paymentMethod ? (
                  <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                    <QrCode className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium text-center px-8">
                      Silakan selesaikan pembayaran via EDC atau Aplikasi Pelanggan
                    </p>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                    <p className="text-gray-500 font-medium">Pilih metode pembayaran</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                disabled={!paymentMethod || (paymentMethod === 'cash' && amountPaid < total)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none rounded-xl text-white font-bold text-lg mt-6 shadow-md transition-colors"
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {showReceiptPreview && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <style type="text/css" media="print">
            {`
              body * {
                visibility: hidden;
              }
              #receipt-content, #receipt-content * {
                visibility: visible;
              }
              #receipt-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                margin: 0;
                padding: 10px;
                box-shadow: none !important;
              }
              #receipt-actions {
                display: none !important;
              }
            `}
          </style>
          <div id="receipt-content" className="bg-white rounded-xl w-[380px] p-8 shadow-2xl flex flex-col text-gray-900 font-mono text-sm relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-[radial-gradient(circle,white_4px,transparent_5px)] bg-[length:10px_10px] -translate-y-1/2 print:hidden"></div>
            
            <div className="text-center mb-6">
              <h2 className="font-bold text-xl mb-1">KASIRPRO</h2>
              <p className="text-xs text-gray-500">Jl. Teknologi No. 123, Jakarta</p>
              <p className="text-xs text-gray-500">Telp: 021-555-0123</p>
            </div>

            <div className="border-b border-dashed border-gray-300 pb-3 mb-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Tgl:</span> <span>{new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">No:</span> <span>INV-{Math.floor(Math.random()*1000000)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kasir:</span> <span>Admin</span></div>
            </div>

            <div className="flex-1 space-y-3 min-h-[150px]">
              {cart.map(item => (
                <div key={item.id}>
                  <div className="font-semibold">{item.name}</div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
                    <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 mt-3 space-y-1 font-semibold">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>PPN 11%</span>
                <span>{tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-base mt-2">
                <span>TOTAL</span>
                <span>{total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div className="border-t border-dashed border-gray-300 pt-3 mt-3 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Tunai</span>
                  <span>{amountPaid.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembali</span>
                  <span>{change.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            <div className="text-center mt-8 text-xs text-gray-500">
              <p>Terima kasih atas kunjungan Anda!</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar.</p>
            </div>

            {/* Action Buttons Overlay */}
            <div id="receipt-actions" className="absolute -right-20 top-0 bottom-0 flex flex-col justify-center gap-3">
              <button 
                onClick={finishTransaction}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 print:hidden"
                title="Selesai & Print"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowReceiptPreview(false)}
                className="w-14 h-14 bg-white text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 print:hidden mt-2 border border-red-100"
                title="Batal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
