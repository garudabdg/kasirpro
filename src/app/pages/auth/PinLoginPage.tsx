import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Delete } from 'lucide-react';

export default function PinLoginPage() {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        // Auto-submit when 4 digits entered
        setTimeout(() => navigate('/pos'), 500);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Login Kasir</h1>
          <p className="text-gray-400">Masukkan PIN 4 digit Anda</p>
        </div>

        {/* PIN Display */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center ${
                  pin.length > i
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {pin.length > i && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-semibold text-gray-900 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-semibold text-gray-900 transition-colors"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-colors"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>

          {/* Back to Admin Login */}
          <Link
            to="/login"
            className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
          >
            Kembali ke Login Admin
          </Link>
        </div>

        {/* Quick Access Buttons */}
        <div className="mt-6 space-y-2">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Quick Access</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Kasir 01
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Kasir 02
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Kasir 03
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
