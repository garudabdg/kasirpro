import { create } from 'zustand';

// --- Types ---
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
}

export interface CartItem extends Product {
  qty: number;
}

interface StoreState {
  // --- Products ---
  products: Product[];
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;

  // --- Cart ---
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartTotal: () => number;

  // --- Auth/User ---
  user: { name: string; role: string } | null;
  login: (name: string, role: string) => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // --- Products ---
  products: [],
  setProducts: (products) => set({ products }),
  fetchProducts: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      // Map database schema to UI schema
      const mappedProducts = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.selling_price),
        category: item.category?.slug || 'unknown',
        stock: item.inventories && item.inventories.length > 0 
                 ? Number(item.inventories[0].stock_on_hand) 
                 : 0,
        sku: item.sku,
      }));
      
      set({ products: mappedProducts });
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    }
  },

  // --- Cart ---
  cart: [],
  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    });
  },
  updateQty: (id, delta) => {
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    }));
  },
  removeItem: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },
  clearCart: () => set({ cart: [] }),
  getCartSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  getCartTax: () => {
    return Math.round(get().getCartSubtotal() * 0.11); // PPN 11%
  },
  getCartTotal: () => {
    return get().getCartSubtotal() + get().getCartTax();
  },

  // --- Auth/User ---
  user: { name: 'Kasir 1', role: 'cashier' }, // Default mock user
  login: (name, role) => set({ user: { name, role } }),
  logout: () => set({ user: null }),
}));
