import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import POSLayout from "./layouts/POSLayout";
import LoginPage from "./pages/auth/LoginPage";
import PinLoginPage from "./pages/auth/PinLoginPage";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import AdminStoreDashboard from "./pages/dashboard/AdminStoreDashboard";
import AdminFinanceDashboard from "./pages/dashboard/AdminFinanceDashboard";
import POSPage from "./pages/pos/POSPage";
import ProductListPage from "./pages/products/ProductListPage";
import ProductCreatePage from "./pages/products/ProductCreatePage";
import ProductEditPage from "./pages/products/ProductEditPage";
import StockListPage from "./pages/inventory/StockListPage";
import StockOpnamePage from "./pages/inventory/StockOpnamePage";
import TransactionListPage from "./pages/transactions/TransactionListPage";
import TransactionDetailPage from "./pages/transactions/TransactionDetailPage";
import CustomerListPage from "./pages/customers/CustomerListPage";
import SupplierListPage from "./pages/suppliers/SupplierListPage";
import POListPage from "./pages/purchase-orders/POListPage";
import POCreatePage from "./pages/purchase-orders/POCreatePage";
import SalesReportPage from "./pages/reports/SalesReportPage";
import InventoryReportPage from "./pages/reports/InventoryReportPage";
import FinancialReportPage from "./pages/reports/FinancialReportPage";
import ShiftOpenPage from "./pages/shifts/ShiftOpenPage";
import ShiftClosePage from "./pages/shifts/ShiftClosePage";
import UserListPage from "./pages/users/UserListPage";
import StoreListPage from "./pages/stores/StoreListPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotFoundPage from "./pages/errors/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/pin-login",
    element: <PinLoginPage />,
  },
  {
    path: "/pos",
    element: <POSLayout />,
    children: [
      { index: true, element: <POSPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: "dashboard/admin", element: <AdminStoreDashboard /> },
      { path: "dashboard/finance", element: <AdminFinanceDashboard /> },
      
      // Products
      { path: "products", element: <ProductListPage /> },
      { path: "products/create", element: <ProductCreatePage /> },
      { path: "products/edit/:id", element: <ProductEditPage /> },
      
      // Inventory
      { path: "inventory", element: <StockListPage /> },
      { path: "inventory/opname", element: <StockOpnamePage /> },
      
      // Transactions
      { path: "transactions", element: <TransactionListPage /> },
      { path: "transactions/:id", element: <TransactionDetailPage /> },
      
      // Customers
      { path: "customers", element: <CustomerListPage /> },
      
      // Suppliers
      { path: "suppliers", element: <SupplierListPage /> },
      
      // Purchase Orders
      { path: "purchase-orders", element: <POListPage /> },
      { path: "purchase-orders/create", element: <POCreatePage /> },
      
      // Reports
      { path: "reports/sales", element: <SalesReportPage /> },
      { path: "reports/inventory", element: <InventoryReportPage /> },
      { path: "reports/financial", element: <FinancialReportPage /> },
      
      // Shifts
      { path: "shifts/open", element: <ShiftOpenPage /> },
      { path: "shifts/close", element: <ShiftClosePage /> },
      
      // Users
      { path: "users", element: <UserListPage /> },
      
      // Stores
      { path: "stores", element: <StoreListPage /> },
      
      // Settings
      { path: "settings", element: <SettingsPage /> },
      
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
