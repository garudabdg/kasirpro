
# KasirPro — React.js Project Structure
# Enterprise POS Application for Large-Scale Retail

kasirpro/
│
├── 📁 public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── favicon.ico
│   └── 📁 assets/
│       ├── 📁 images/
│       │   ├── logo.png
│       │   ├── logo-dark.png
│       │   └── placeholder-product.png
│       ├── 📁 icons/
│       │   ├── barcode-icon.svg
│       │   ├── printer-icon.svg
│       │   └── pos-icon.svg
│       └── 📁 sounds/
│           ├── beep-success.mp3
│           └── beep-error.mp3
│
├── 📁 src/
│   │
│   ├── 📁 api/
│   │   ├── axiosInstance.js          # Axios config + interceptors (JWT, refresh token)
│   │   ├── endpoints.js              # Centralized API endpoint definitions
│   │   ├── 📁 services/
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── inventoryService.js
│   │   │   ├── transactionService.js
│   │   │   ├── customerService.js
│   │   │   ├── supplierService.js
│   │   │   ├── purchaseOrderService.js
│   │   │   ├── promotionService.js
│   │   │   ├── reportService.js
│   │   │   ├── shiftService.js
│   │   │   ├── paymentService.js
│   │   │   ├── expenseService.js
│   │   │   ├── printService.js
│   │   │   └── storeService.js
│   │   └── 📁 hooks/
│   │       ├── useApi.js             # Generic API hook with loading/error states
│   │       ├── useAuth.js
│   │       ├── useProducts.js
│   │       ├── useInventory.js
│   │       └── useTransactions.js
│   │
│   ├── 📁 components/
│   │   ├── 📁 common/                # Reusable UI components (atomic design)
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.jsx
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Input.module.css
│   │   │   │   └── Input.test.jsx
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Table/
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── TablePagination.jsx
│   │   │   │   └── Table.module.css
│   │   │   ├── Card/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Card.module.css
│   │   │   ├── Badge/
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── Loading/
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── Loading.module.css
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── EmptyState.module.css
│   │   │   ├── SearchBar/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── SearchBar.module.css
│   │   │   ├── DateRangePicker/
│   │   │   │   ├── DateRangePicker.jsx
│   │   │   │   └── DateRangePicker.module.css
│   │   │   ├── FileUpload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── FileUpload.module.css
│   │   │   ├── BarcodeScanner/
│   │   │   │   ├── BarcodeScanner.jsx
│   │   │   │   └── BarcodeScanner.module.css
│   │   │   ├── Notification/
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── ToastContainer.jsx
│   │   │   │   └── Notification.module.css
│   │   │   └── index.js              # Barrel export
│   │   │
│   │   ├── 📁 layout/                # Layout components
│   │   │   ├── MainLayout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   ├── Breadcrumb.jsx
│   │   │   │   └── MainLayout.module.css
│   │   │   ├── AuthLayout/
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   └── AuthLayout.module.css
│   │   │   ├── POSLayout/
│   │   │   │   ├── POSLayout.jsx
│   │   │   │   ├── POSHeader.jsx
│   │   │   │   ├── POSFooter.jsx
│   │   │   │   └── POSLayout.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 pos/                   # POS-specific components
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── Cart.module.css
│   │   │   ├── ProductGrid/
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   └── ProductGrid.module.css
│   │   │   ├── PaymentPanel/
│   │   │   │   ├── PaymentPanel.jsx
│   │   │   │   ├── PaymentMethodSelector.jsx
│   │   │   │   ├── CashPayment.jsx
│   │   │   │   ├── QRISPayment.jsx
│   │   │   │   ├── SplitPayment.jsx
│   │   │   │   └── PaymentPanel.module.css
│   │   │   ├── ReceiptPreview/
│   │   │   │   ├── ReceiptPreview.jsx
│   │   │   │   └── ReceiptPreview.module.css
│   │   │   ├── CustomerSearch/
│   │   │   │   ├── CustomerSearch.jsx
│   │   │   │   └── CustomerSearch.module.css
│   │   │   ├── HoldTransaction/
│   │   │   │   ├── HoldTransaction.jsx
│   │   │   │   └── HoldTransaction.module.css
│   │   │   ├── ReturnModal/
│   │   │   │   ├── ReturnModal.jsx
│   │   │   │   └── ReturnModal.module.css
│   │   │   ├── VoidModal/
│   │   │   │   ├── VoidModal.jsx
│   │   │   │   └── VoidModal.module.css
│   │   │   ├── DiscountModal/
│   │   │   │   ├── DiscountModal.jsx
│   │   │   │   └── DiscountModal.module.css
│   │   │   ├── Numpad/
│   │   │   │   ├── Numpad.jsx
│   │   │   │   └── Numpad.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 dashboard/             # Dashboard widgets
│   │   │   ├── RevenueChart/
│   │   │   │   ├── RevenueChart.jsx
│   │   │   │   └── RevenueChart.module.css
│   │   │   ├── SalesOverview/
│   │   │   │   ├── SalesOverview.jsx
│   │   │   │   └── SalesOverview.module.css
│   │   │   ├── TopProducts/
│   │   │   │   ├── TopProducts.jsx
│   │   │   │   └── TopProducts.module.css
│   │   │   ├── LowStockAlert/
│   │   │   │   ├── LowStockAlert.jsx
│   │   │   │   └── LowStockAlert.module.css
│   │   │   ├── RecentTransactions/
│   │   │   │   ├── RecentTransactions.jsx
│   │   │   │   └── RecentTransactions.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 inventory/             # Inventory-specific components
│   │   │   ├── StockTable/
│   │   │   │   ├── StockTable.jsx
│   │   │   │   └── StockTable.module.css
│   │   │   ├── StockMovementLog/
│   │   │   │   ├── StockMovementLog.jsx
│   │   │   │   └── StockMovementLog.module.css
│   │   │   ├── StockOpname/
│   │   │   │   ├── StockOpnameForm.jsx
│   │   │   │   ├── StockOpnameScanner.jsx
│   │   │   │   └── StockOpname.module.css
│   │   │   ├── BatchTracker/
│   │   │   │   ├── BatchTracker.jsx
│   │   │   │   └── BatchTracker.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 product/               # Product management components
│   │   │   ├── ProductForm/
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── VariantManager.jsx
│   │   │   │   ├── BarcodeManager.jsx
│   │   │   │   ├── PriceTierManager.jsx
│   │   │   │   └── ProductForm.module.css
│   │   │   ├── ProductImageUploader/
│   │   │   │   ├── ProductImageUploader.jsx
│   │   │   │   └── ProductImageUploader.module.css
│   │   │   ├── CategoryTree/
│   │   │   │   ├── CategoryTree.jsx
│   │   │   │   └── CategoryTree.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 customer/            # Customer/CRM components
│   │   │   ├── CustomerForm/
│   │   │   │   ├── CustomerForm.jsx
│   │   │   │   └── CustomerForm.module.css
│   │   │   ├── LoyaltyCard/
│   │   │   │   ├── LoyaltyCard.jsx
│   │   │   │   └── LoyaltyCard.module.css
│   │   │   ├── PointHistory/
│   │   │   │   ├── PointHistory.jsx
│   │   │   │   └── PointHistory.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 report/              # Report components
│   │   │   ├── ReportFilter/
│   │   │   │   ├── ReportFilter.jsx
│   │   │   │   └── ReportFilter.module.css
│   │   │   ├── ReportChart/
│   │   │   │   ├── ReportChart.jsx
│   │   │   │   └── ReportChart.module.css
│   │   │   ├── ExportButton/
│   │   │   │   ├── ExportButton.jsx
│   │   │   │   └── ExportButton.module.css
│   │   │   └── index.js
│   │   │
│   │   └── 📁 shift/               # Shift management components
│   │       ├── ShiftOpener/
│   │       │   ├── ShiftOpener.jsx
│   │       │   └── ShiftOpener.module.css
│   │       ├── ShiftCloser/
│   │       │   ├── ShiftCloser.jsx
│   │       │   └── ShiftCloser.module.css
│   │       ├── ShiftReport/
│   │       │   ├── ShiftReport.jsx
│   │       │   └── ShiftReport.module.css
│   │       └── index.js
│   │
│   ├── 📁 pages/                   # Route-level page components
│   │   ├── 📁 auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.module.css
│   │   │   ├── PinLoginPage.jsx
│   │   │   ├── PinLoginPage.module.css
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── TwoFactorPage.jsx
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── SuperAdminDashboard.jsx
│   │   │   ├── AdminFinanceDashboard.jsx
│   │   │   ├── AdminStoreDashboard.jsx
│   │   │   └── Dashboard.module.css
│   │   │
│   │   ├── 📁 pos/
│   │   │   ├── POSPage.jsx
│   │   │   ├── POSPage.module.css
│   │   │   ├── OfflinePOSPage.jsx
│   │   │   └── CustomerDisplayPage.jsx
│   │   │
│   │   ├── 📁 products/
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductCreatePage.jsx
│   │   │   ├── ProductEditPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CategoryListPage.jsx
│   │   │   └── Products.module.css
│   │   │
│   │   ├── 📁 inventory/
│   │   │   ├── StockListPage.jsx
│   │   │   ├── StockInPage.jsx
│   │   │   ├── StockOutPage.jsx
│   │   │   ├── StockOpnamePage.jsx
│   │   │   ├── StockTransferPage.jsx
│   │   │   ├── StockAdjustmentPage.jsx
│   │   │   └── Inventory.module.css
│   │   │
│   │   ├── 📁 transactions/
│   │   │   ├── TransactionListPage.jsx
│   │   │   ├── TransactionDetailPage.jsx
│   │   │   ├── ReturnPage.jsx
│   │   │   ├── VoidPage.jsx
│   │   │   └── Transactions.module.css
│   │   │
│   │   ├── 📁 customers/
│   │   │   ├── CustomerListPage.jsx
│   │   │   ├── CustomerCreatePage.jsx
│   │   │   ├── CustomerDetailPage.jsx
│   │   │   ├── LoyaltyProgramPage.jsx
│   │   │   └── Customers.module.css
│   │   │
│   │   ├── 📁 suppliers/
│   │   │   ├── SupplierListPage.jsx
│   │   │   ├── SupplierCreatePage.jsx
│   │   │   ├── SupplierDetailPage.jsx
│   │   │   └── Suppliers.module.css
│   │   │
│   │   ├── 📁 purchase-orders/
│   │   │   ├── POListPage.jsx
│   │   │   ├── POCreatePage.jsx
│   │   │   ├── PODetailPage.jsx
│   │   │   ├── POApprovalPage.jsx
│   │   │   ├── GoodsReceivedPage.jsx
│   │   │   └── PurchaseOrders.module.css
│   │   │
│   │   ├── 📁 promotions/
│   │   │   ├── PromotionListPage.jsx
│   │   │   ├── PromotionCreatePage.jsx
│   │   │   ├── VoucherListPage.jsx
│   │   │   └── Promotions.module.css
│   │   │
│   │   ├── 📁 reports/
│   │   │   ├── SalesReportPage.jsx
│   │   │   ├── InventoryReportPage.jsx
│   │   │   ├── FinancialReportPage.jsx
│   │   │   ├── TaxReportPage.jsx
│   │   │   ├── CashFlowReportPage.jsx
│   │   │   ├── CustomReportPage.jsx
│   │   │   └── Reports.module.css
│   │   │
│   │   ├── 📁 finance/
│   │   │   ├── ExpenseListPage.jsx
│   │   │   ├── ExpenseCreatePage.jsx
│   │   │   ├── PayableListPage.jsx
│   │   │   ├── ReceivableListPage.jsx
│   │   │   ├── CashDrawerPage.jsx
│   │   │   └── Finance.module.css
│   │   │
│   │   ├── 📁 shifts/
│   │   │   ├── ShiftListPage.jsx
│   │   │   ├── ShiftOpenPage.jsx
│   │   │   ├── ShiftClosePage.jsx
│   │   │   └── Shifts.module.css
│   │   │
│   │   ├── 📁 users/
│   │   │   ├── UserListPage.jsx
│   │   │   ├── UserCreatePage.jsx
│   │   │   ├── RoleManagementPage.jsx
│   │   │   └── Users.module.css
│   │   │
│   │   ├── 📁 stores/
│   │   │   ├── StoreListPage.jsx
│   │   │   ├── StoreCreatePage.jsx
│   │   │   ├── StoreSettingsPage.jsx
│   │   │   └── Stores.module.css
│   │   │
│   │   ├── 📁 settings/
│   │   │   ├── GeneralSettingsPage.jsx
│   │   │   ├── ReceiptTemplatePage.jsx
│   │   │   ├── PrinterConfigPage.jsx
│   │   │   ├── TaxSettingsPage.jsx
│   │   │   ├── NotificationSettingsPage.jsx
│   │   │   └── Settings.module.css
│   │   │
│   │   ├── 📁 audit/
│   │   │   ├── AuditLogPage.jsx
│   │   │   └── Audit.module.css
│   │   │
│   │   └── 📁 errors/
│   │       ├── NotFoundPage.jsx
│   │       ├── UnauthorizedPage.jsx
│   │       └── ServerErrorPage.jsx
│   │
│   ├── 📁 hooks/                     # Custom React hooks
│   │   ├── useAuth.js                # Authentication state & methods
│   │   ├── usePermission.js          # RBAC permission checking
│   │   ├── useLocalStorage.js        # localStorage wrapper
│   │   ├── useDebounce.js            # Debounce for search inputs
│   │   ├── useBarcodeScanner.js      # Barcode scanner integration
│   │   ├── usePrinter.js             # Thermal printer integration
│   │   ├── useOffline.js             # Offline mode detection & queue
│   │   ├── useSync.js                # Background sync manager
│   │   ├── useShift.js               # Current shift state
│   │   ├── useCart.js                # POS cart state management
│   │   ├── useNotification.js        # Toast/notification system
│   │   ├── usePagination.js          # Pagination logic
│   │   ├── useSort.js                # Table sorting logic
│   │   ├── useFilter.js              # Data filtering logic
│   │   ├── useExport.js              # Export to PDF/Excel/CSV
│   │   ├── useWebSocket.js           # Real-time WebSocket connection
│   │   ├── useIdleTimer.js           # Auto-logout on idle
│   │   └── index.js
│   │
│   ├── 📁 context/                   # React Context providers
│   │   ├── AuthContext.jsx           # Authentication context
│   │   ├── ThemeContext.jsx          # Dark/light mode context
│   │   ├── StoreContext.jsx          # Selected store context
│   │   ├── ShiftContext.jsx          # Active shift context
│   │   ├── CartContext.jsx           # POS cart context
│   │   ├── NotificationContext.jsx   # Global notification context
│   │   ├── OfflineContext.jsx        # Offline mode context
│   │   ├── PermissionContext.jsx     # RBAC permission context
│   │   └── index.js
│   │
│   ├── 📁 store/                     # State management (Zustand / Redux)
│   │   ├── 📁 slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── inventorySlice.js
│   │   │   ├── transactionSlice.js
│   │   │   ├── customerSlice.js
│   │   │   ├── shiftSlice.js
│   │   │   ├── uiSlice.js            # UI state (sidebar, modals, loading)
│   │   │   └── notificationSlice.js
│   │   ├── store.js                  # Zustand store configuration
│   │   └── index.js
│   │
│   ├── 📁 utils/                     # Utility functions
│   │   ├── constants.js              # App constants (roles, statuses, etc.)
│   │   ├── enums.js                  # Enum definitions
│   │   ├── formatters.js             # Currency, date, number formatters
│   │   ├── validators.js             # Form validation helpers
│   │   ├── calculations.js           # POS calculations (subtotal, tax, discount, change)
│   │   ├── barcodeGenerator.js       # Barcode/SKU generation
│   │   ├── invoiceGenerator.js       # Invoice number generation
│   │   ├── receiptBuilder.js         # Receipt content builder
│   │   ├── exportHelpers.js          # PDF/Excel/CSV export helpers
│   │   ├── dateHelpers.js            # Date manipulation helpers
│   │   ├── stringHelpers.js          # String manipulation helpers
│   │   ├── numberHelpers.js          # Number rounding, pembulatan rupiah
│   │   ├── storageHelpers.js         # localStorage/indexedDB helpers
│   │   ├── errorHandlers.js          # Error handling utilities
│   │   ├── permissionMatrix.js       # RBAC permission matrix
│   │   └── index.js
│   │
│   ├── 📁 config/                    # Configuration files
│   │   ├── routes.js                 # Route definitions & guards
│   │   ├── menuConfig.js             # Sidebar menu items per role
│   │   ├── themeConfig.js            # Theme colors, fonts, breakpoints
│   │   ├── printerConfig.js          # ESC/POS printer commands
│   │   ├── paymentConfig.js          # Payment method configurations
│   │   ├── taxConfig.js              # Tax rate configurations
│   │   ├── receiptConfig.js          # Receipt template defaults
│   │   ├── apiConfig.js              # API base URLs, timeouts
│   │   ├── offlineConfig.js          # Offline mode settings
│   │   └── index.js
│   │
│   ├── 📁 services/                  # Business logic services
│   │   ├── authService.js            # Login, logout, token refresh, 2FA
│   │   ├── cartService.js            # Cart operations (add, remove, calculate)
│   │   ├── paymentService.js         # Payment processing (cash, QRIS, debit)
│   │   ├── printService.js           # Thermal printer service (ESC/POS)
│   │   ├── syncService.js            # Offline sync queue service
│   │   ├── receiptService.js         # Receipt generation & printing
│   │   ├── reportService.js          # Report data aggregation
│   │   ├── inventoryService.js       # Stock calculations & alerts
│   │   ├── notificationService.js    # Push notification service
│   │   ├── websocketService.js       # Real-time sync service
│   │   └── index.js
│   │
│   ├── 📁 workers/                   # Web Workers
│   │   ├── syncWorker.js             # Background sync worker
│   │   ├── reportWorker.js           # Report generation worker
│   │   ├── barcodeWorker.js          # Barcode processing worker
│   │   └── index.js
│   │
│   ├── 📁 styles/                    # Global styles
│   │   ├── global.css                # Global CSS reset & base styles
│   │   ├── variables.css             # CSS custom properties (colors, spacing)
│   │   ├── animations.css            # Keyframe animations
│   │   ├── print.css                 # Print-specific styles
│   │   ├── pos.css                   # POS-specific styles
│   │   └── index.css                 # Main stylesheet import
│   │
│   ├── 📁 types/                     # TypeScript type definitions (if using TS)
│   │   ├── auth.types.js
│   │   ├── product.types.js
│   │   ├── transaction.types.js
│   │   ├── inventory.types.js
│   │   ├── customer.types.js
│   │   ├── payment.types.js
│   │   ├── report.types.js
│   │   └── index.js
│   │
│   ├── 📁 data/                      # Static/mock data
│   │   ├── mockProducts.js
│   │   ├── mockTransactions.js
│   │   ├── mockCustomers.js
│   │   ├── menuItems.js
│   │   └── seedData.js
│   │
│   ├── 📁 assets/                    # Source assets (processed by build)
│   │   ├── 📁 images/
│   │   ├── 📁 icons/
│   │   ├── 📁 fonts/
│   │   └── 📁 lotties/
│   │
│   ├── 📁 tests/                     # Test configurations & utilities
│   │   ├── setupTests.js
│   │   ├── testUtils.js
│   │   ├── 📁 mocks/
│   │   │   ├── mockApi.js
│   │   │   ├── mockAuth.js
│   │   │   └── mockData.js
│   │   └── 📁 e2e/
│   │       ├── posFlow.spec.js
│   │       └── inventoryFlow.spec.js
│   │
│   ├── App.jsx                       # Root component
│   ├── App.module.css
│   ├── index.js                      # Entry point
│   ├── reportWebVitals.js
│   └── setupProxy.js                 # Dev proxy config
│
├── 📁 .github/                       # GitHub Actions CI/CD
│   └── 📁 workflows/
│       ├── ci.yml
│       ├── deploy-staging.yml
│       └── deploy-production.yml
│
├── 📁 scripts/                       # Build & deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── generate-icons.js
│
├── .env.development
├── .env.staging
├── .env.production
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── jsconfig.json                     # Path aliases config
├── package.json
├── package-lock.json
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js
├── craco.config.js                   # CRA customization
├── README.md
└── LICENSE
