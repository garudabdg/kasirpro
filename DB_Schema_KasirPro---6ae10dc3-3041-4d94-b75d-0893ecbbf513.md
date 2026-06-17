# Database Schema — KasirPro
## Struktur Database PostgreSQL

---

## 1. Overview

Database: **PostgreSQL 15**  
Schema: **public** (multi-tenant via `merchant_id`)  
Engine: InnoDB-equivalent, Row-Level Security optional  
Collation: UTF-8  
Total Tables: **40+**

---

## 2. Entity Relationship Diagram (Simplified)

```
merchants ──→ stores ──→ users ──→ roles
                  │
     ┌────────────┼────────────┬──────────────┐
     ▼            ▼            ▼              ▼
 products    inventory    customers      suppliers
     │            │            │              │
     └────────────┼────────────┘              │
                  ▼                           ▼
            transactions ────────→ purchase_orders
                  │                       │
     ┌────────────┼────────────┐          │
     ▼            ▼            ▼          ▼
 payments   transaction_   shifts    po_items
             _items                    │
                                  goods_received
```

---

## 3. Schema DDL

### 3.1 Authentication & Multi-Tenant

```sql
-- ============================================
-- TENANT / MERCHANT
-- ============================================
CREATE TABLE merchants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    logo_url        TEXT,
    address         TEXT,
    phone           VARCHAR(30),
    email           VARCHAR(255),
    tax_id          VARCHAR(50),              -- NPWP
    subscription    VARCHAR(20) DEFAULT 'trial', -- trial, basic, pro, enterprise
    is_active       BOOLEAN DEFAULT true,
    settings        JSONB DEFAULT '{}',        -- timezone, currency, language, dll
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STORE / CABANG
-- ============================================
CREATE TABLE stores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    code            VARCHAR(20) NOT NULL,      -- STORE-001, STORE-002
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    phone           VARCHAR(30),
    email           VARCHAR(255),
    timezone        VARCHAR(50) DEFAULT 'Asia/Jakarta',
    is_active       BOOLEAN DEFAULT true,
    settings        JSONB DEFAULT '{}',        -- receipt_footer, tax_percentage, rounding_rule
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, code)
);

-- ============================================
-- ROLES
-- ============================================
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,       -- super_admin, admin_finance, admin_store, cashier, warehouse
    permissions     JSONB NOT NULL DEFAULT '[]',  -- list permission keys
    is_system       BOOLEAN DEFAULT false,      -- built-in roles (tidak bisa dihapus)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id),
    store_id        UUID REFERENCES stores(id),     -- nullable untuk super_admin
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(30),
    pin             VARCHAR(60),                     -- bcrypt hashed, untuk kasir login
    password_hash   VARCHAR(255),                    -- bcrypt, untuk admin login
    avatar_url      TEXT,
    is_active       BOOLEAN DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    last_login_ip   VARCHAR(45),
    failed_attempts INT DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret  VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, email)
);

-- ============================================
-- REFRESH TOKENS
-- ============================================
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    device_info     VARCHAR(255),
    ip_address      VARCHAR(45),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    store_id        UUID REFERENCES stores(id),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,       -- create, update, delete, login, logout, void
    entity_type     VARCHAR(50) NOT NULL,       -- product, transaction, inventory, user, dll
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_merchant ON audit_logs(merchant_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

### 3.2 Product & Inventory

```sql
-- ============================================
-- PRODUCT CATEGORIES (Tree Structure)
-- ============================================
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    parent_id       UUID REFERENCES categories(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,
    description     TEXT,
    image_url       TEXT,
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, slug)
);

-- ============================================
-- TAX RATES
-- ============================================
CREATE TABLE tax_rates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,       -- PPN 11%, Non-PPN, PPN BM
    rate            DECIMAL(5,2) NOT NULL,       -- 11.00
    is_default      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT UNITS / SATUAN
-- ============================================
CREATE TABLE units (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,        -- pcs, box, karton, lusin, kg, liter
    symbol          VARCHAR(10),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

-- ============================================
-- UNIT CONVERSIONS (konversi satuan)
-- ============================================
CREATE TABLE unit_conversions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    from_unit_id    UUID NOT NULL REFERENCES units(id),
    to_unit_id      UUID NOT NULL REFERENCES units(id),
    multiplier      DECIMAL(15,4) NOT NULL,      -- 1 box = 12 pcs → multiplier 12
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, from_unit_id, to_unit_id)
);

-- ============================================
-- BRANDS (Merk)
-- ============================================
CREATE TABLE brands (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    image_url       TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

-- ============================================
-- PRODUCTS (Master Barang)
-- ============================================
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id),
    brand_id        UUID REFERENCES brands(id),
    tax_rate_id     UUID REFERENCES tax_rates(id),
    unit_id         UUID REFERENCES units(id),

    sku             VARCHAR(100) NOT NULL,       -- auto-generated: PROD-000001
    barcode         VARCHAR(100),                -- primary barcode
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255),
    description     TEXT,
    image_urls      TEXT[] DEFAULT '{}',         -- array of image URLs

    -- Harga
    cost_price      DECIMAL(15,2) DEFAULT 0,    -- HPP / harga beli
    selling_price   DECIMAL(15,2) DEFAULT 0,    -- harga jual retail
    wholesale_price DECIMAL(15,2) DEFAULT 0,    -- harga grosir
    member_price    DECIMAL(15,2) DEFAULT 0,    -- harga member

    -- Status
    track_inventory BOOLEAN DEFAULT true,
    has_variant     BOOLEAN DEFAULT false,
    has_batch       BOOLEAN DEFAULT false,       -- track batch/expiry
    is_service      BOOLEAN DEFAULT false,       -- jasa (non-stock)
    is_active       BOOLEAN DEFAULT true,

    -- Stock settings
    min_stock       DECIMAL(15,4) DEFAULT 0,
    max_stock       DECIMAL(15,4) DEFAULT 0,
    reorder_point   DECIMAL(15,4) DEFAULT 0,

    -- Metadata
    weight          DECIMAL(10,2),               -- gram
    dimension       VARCHAR(100),                -- PxLxT cm
    tags            TEXT[] DEFAULT '{}',

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_products_sku ON products(merchant_id, sku);
CREATE INDEX idx_products_barcode ON products(merchant_id, barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('indonesian', name));

-- ============================================
-- PRODUCT VARIANTS (Multi-Variant)
-- ============================================
CREATE TABLE variant_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,       -- Ukuran, Warna, Rasa, Model
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

CREATE TABLE variant_values (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_type_id UUID NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
    value           VARCHAR(100) NOT NULL,       -- Merah, Biru, XL, L, M
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_variants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku             VARCHAR(100) NOT NULL,
    barcode         VARCHAR(100),

    -- Variant combinations
    variant1_type_id UUID REFERENCES variant_types(id),
    variant1_value_id UUID REFERENCES variant_values(id),
    variant2_type_id UUID REFERENCES variant_types(id),
    variant2_value_id UUID REFERENCES variant_values(id),
    variant3_type_id UUID REFERENCES variant_types(id),
    variant3_value_id UUID REFERENCES variant_values(id),

    -- Variant-specific prices (override induk)
    cost_price      DECIMAL(15,2),
    selling_price   DECIMAL(15,2),
    wholesale_price DECIMAL(15,2),

    -- Variant images
    image_urls      TEXT[] DEFAULT '{}',

    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_variant_sku ON product_variants(sku);

-- ============================================
-- PRODUCT BARCODES (Multiple Barcodes per Product)
-- ============================================
CREATE TABLE product_barcodes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    barcode         VARCHAR(100) NOT NULL,
    is_primary      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(barcode)
);

-- ============================================
-- INVENTORY / STOCK
-- ============================================
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id),
    batch_number    VARCHAR(100),
    expiry_date     DATE,

    stock_on_hand   DECIMAL(15,4) DEFAULT 0,     -- stok tersedia
    stock_reserved  DECIMAL(15,4) DEFAULT 0,     -- stok di-reserve (pending transaksi)
    stock_available DECIMAL(15,4) GENERATED ALWAYS AS  -- computed column
                        (stock_on_hand - stock_reserved) STORED,
    avg_cost        DECIMAL(15,2) DEFAULT 0,     -- average cost (FIFO/AVG)

    last_counted_at TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(store_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'),
           COALESCE(batch_number, ''))
);

CREATE INDEX idx_inventory_store ON inventory(store_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(store_id) WHERE stock_available <= 10;

-- ============================================
-- STOCK MOVEMENTS (Riwayat Stok)
-- ============================================
CREATE TABLE stock_movements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),
    batch_number    VARCHAR(100),
    user_id         UUID REFERENCES users(id),

    movement_type   VARCHAR(30) NOT NULL,        -- stock_in, stock_out, adjustment, transfer_in,
                                                  -- transfer_out, sale, return, expired, damaged, opname
    reference_type  VARCHAR(30),                  -- purchase_order, transaction, stock_opname, transfer
    reference_id    UUID,

    quantity        DECIMAL(15,4) NOT NULL,      -- positif untuk in, negatif untuk out
    unit_cost       DECIMAL(15,2),               -- cost at time of movement
    stock_before    DECIMAL(15,4),
    stock_after     DECIMAL(15,4),
    notes           TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_store ON stock_movements(store_id, created_at DESC);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_ref ON stock_movements(reference_type, reference_id);

-- ============================================
-- STOCK OPNAME (Periodic Stock Checking)
-- ============================================
CREATE TABLE stock_opnames (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    initiated_by    UUID NOT NULL REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'draft',  -- draft, in_progress, completed, approved
    notes           TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_opname_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opname_id       UUID NOT NULL REFERENCES stock_opnames(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),
    system_qty      DECIMAL(15,4) DEFAULT 0,
    actual_qty      DECIMAL(15,4) DEFAULT 0,
    difference      DECIMAL(15,4) GENERATED ALWAYS AS
                        (actual_qty - system_qty) STORED,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Customer & Supplier

```sql
-- ============================================
-- CUSTOMER GROUPS / TIERS
-- ============================================
CREATE TABLE customer_groups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,        -- Regular, Member, VIP
    discount_percent DECIMAL(5,2) DEFAULT 0,
    points_multiplier DECIMAL(5,2) DEFAULT 1.0,  -- 1x, 2x poin
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    group_id        UUID REFERENCES customer_groups(id),
    store_id        UUID REFERENCES stores(id),   -- store where registered

    code            VARCHAR(50),                   -- CUST-000001
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    email           VARCHAR(255),
    address         TEXT,
    gender          VARCHAR(10),
    birth_date      DATE,
    notes           TEXT,

    total_points    INT DEFAULT 0,
    total_spent     DECIMAL(15,2) DEFAULT 0,
    total_visits    INT DEFAULT 0,
    last_visit_at   TIMESTAMPTZ,
    credit_limit    DECIMAL(15,2) DEFAULT 0,
    credit_balance  DECIMAL(15,2) DEFAULT 0,

    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(merchant_id, phone);
CREATE INDEX idx_customers_code ON customers(merchant_id, code);

-- ============================================
-- CUSTOMER ADDRESSES (Multiple)
-- ============================================
CREATE TABLE customer_addresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label           VARCHAR(50) DEFAULT 'Rumah',
    address         TEXT NOT NULL,
    city            VARCHAR(100),
    province        VARCHAR(100),
    postal_code     VARCHAR(10),
    latitude        DECIMAL(10,7),
    longitude       DECIMAL(10,7),
    is_default      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOYALTY POINTS TRANSACTIONS
-- ============================================
CREATE TABLE point_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    store_id        UUID NOT NULL REFERENCES stores(id),
    transaction_id  UUID,                          -- reference to POS transaction

    points          INT NOT NULL,                  -- positive = earn, negative = redeem
    type            VARCHAR(20) NOT NULL,          -- earn, redeem, expire, adjustment, welcome_bonus

    balance_before  INT DEFAULT 0,
    balance_after   INT DEFAULT 0,

    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_point_tx_customer ON point_transactions(customer_id, created_at DESC);

-- ============================================
-- LOYALTY REWARDS
-- ============================================
CREATE TABLE loyalty_rewards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    points_required INT NOT NULL,
    reward_type     VARCHAR(20) NOT NULL,          -- discount, free_item, voucher, cashback
    discount_percent DECIMAL(5,2),
    discount_amount  DECIMAL(15,2),
    product_id      UUID REFERENCES products(id),  -- untuk reward free_item
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUPPLIERS
-- ============================================
CREATE TABLE suppliers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    code            VARCHAR(50),
    name            VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255),
    tax_id          VARCHAR(50),                   -- NPWP Supplier
    contact_person  VARCHAR(255),
    phone           VARCHAR(30),
    email           VARCHAR(255),
    address         TEXT,
    payment_terms   VARCHAR(50),                   -- COD, NET30, NET60
    credit_limit    DECIMAL(15,2) DEFAULT 0,

    bank_name       VARCHAR(100),
    bank_account    VARCHAR(50),
    bank_holder     VARCHAR(255),

    notes           TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUPPLIER PRICES (Harga Supplier per Produk)
-- ============================================
CREATE TABLE supplier_prices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id     UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id),
    supplier_sku    VARCHAR(100),
    price           DECIMAL(15,2) NOT NULL,
    min_order_qty   DECIMAL(10,2) DEFAULT 1,
    lead_time_days  INT,                           -- estimated delivery time
    is_preferred    BOOLEAN DEFAULT false,         -- supplier utama
    last_updated    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(supplier_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'))
);
```

### 3.4 Purchase Order

```sql
-- ============================================
-- PURCHASE ORDERS
-- ============================================
CREATE TABLE purchase_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    supplier_id     UUID NOT NULL REFERENCES suppliers(id),
    created_by      UUID NOT NULL REFERENCES users(id),

    po_number       VARCHAR(50) NOT NULL UNIQUE,   -- PO-20260617-00001
    status          VARCHAR(20) DEFAULT 'draft',   -- draft, pending_approval, approved, ordered,
                                                    -- partially_received, received, cancelled, paid
    order_date      DATE DEFAULT CURRENT_DATE,
    expected_date   DATE,                          -- estimasi kedatangan
    received_date   DATE,

    -- Financial
    subtotal        DECIMAL(15,2) DEFAULT 0,
    tax_amount      DECIMAL(15,2) DEFAULT 0,
    shipping_cost   DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount    DECIMAL(15,2) DEFAULT 0,
    paid_amount     DECIMAL(15,2) DEFAULT 0,

    notes           TEXT,
    internal_notes  TEXT,                          -- notes internal (tidak ke supplier)

    -- Approval
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_po_store ON purchase_orders(store_id, created_at DESC);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);

-- ============================================
-- PO ITEMS
-- ============================================
CREATE TABLE purchase_order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id           UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),

    quantity        DECIMAL(15,4) NOT NULL,
    received_qty    DECIMAL(15,4) DEFAULT 0,
    unit_price      DECIMAL(15,2) NOT NULL,
    tax_rate        DECIMAL(5,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    subtotal        DECIMAL(15,2) GENERATED ALWAYS AS
                        (quantity * unit_price - (quantity * unit_price * discount_percent / 100)) STORED,

    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GOODS RECEIVED NOTES (Penerimaan Barang)
-- ============================================
CREATE TABLE goods_received (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id           UUID NOT NULL REFERENCES purchase_orders(id),
    store_id        UUID NOT NULL REFERENCES stores(id),
    received_by     UUID NOT NULL REFERENCES users(id),

    grn_number      VARCHAR(50) NOT NULL UNIQUE,   -- GRN-20260617-00001
    receipt_date    DATE DEFAULT CURRENT_DATE,
    invoice_number  VARCHAR(100),                  -- nomor invoice supplier
    notes           TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE goods_received_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_id          UUID NOT NULL REFERENCES goods_received(id) ON DELETE CASCADE,
    po_item_id      UUID NOT NULL REFERENCES purchase_order_items(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),

    quantity        DECIMAL(15,4) NOT NULL,
    batch_number    VARCHAR(100),
    expiry_date     DATE,
    unit_cost       DECIMAL(15,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 Transactions / POS

```sql
-- ============================================
-- SHIFTS
-- ============================================
CREATE TABLE shifts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    user_id         UUID NOT NULL REFERENCES users(id),   -- kasir
    shift_number    VARCHAR(50) NOT NULL,

    opening_time    TIMESTAMPTZ NOT NULL,
    closing_time    TIMESTAMPTZ,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    closing_balance DECIMAL(15,2),

    -- Rekap
    total_cash      DECIMAL(15,2) DEFAULT 0,
    total_non_cash  DECIMAL(15,2) DEFAULT 0,
    total_sales     DECIMAL(15,2) DEFAULT 0,
    total_refund    DECIMAL(15,2) DEFAULT 0,
    transaction_count INT DEFAULT 0,

    -- Selisih
    expected_cash   DECIMAL(15,2),
    actual_cash     DECIMAL(15,2),
    cash_difference DECIMAL(15,2),

    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'open',   -- open, closed

    handover_to     UUID REFERENCES users(id),    -- serah terima ke kasir berikutnya

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, shift_number)
);

CREATE INDEX idx_shifts_user ON shifts(user_id, created_at DESC);

-- ============================================
-- CASH DRAWER EVENTS
-- ============================================
CREATE TABLE cash_drawer_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id        UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),

    event_type      VARCHAR(20) NOT NULL,          -- open, close, add_cash, remove_cash, count
    amount          DECIMAL(15,2),
    balance_after   DECIMAL(15,2),
    reason          VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS (POS)
-- ============================================
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    shift_id        UUID REFERENCES shifts(id),
    user_id         UUID NOT NULL REFERENCES users(id),    -- kasir
    customer_id     UUID REFERENCES customers(id),

    invoice_number  VARCHAR(50) NOT NULL,          -- INV/STORE001/20260617/00001
    transaction_date TIMESTAMPTZ DEFAULT NOW(),

    -- Financial
    subtotal        DECIMAL(15,2) DEFAULT 0,      -- sebelum diskon & pajak
    discount_total  DECIMAL(15,2) DEFAULT 0,
    tax_total       DECIMAL(15,2) DEFAULT 0,
    rounding        DECIMAL(15,2) DEFAULT 0,      -- pembulatan
    grand_total     DECIMAL(15,2) DEFAULT 0,      -- total akhir
    paid_amount     DECIMAL(15,2) DEFAULT 0,
    change_amount   DECIMAL(15,2) DEFAULT 0,

    -- Status
    status          VARCHAR(20) DEFAULT 'completed', -- completed, voided, refunded, partial_refund, hold
    void_reason     TEXT,
    voided_by       UUID REFERENCES users(id),
    voided_at       TIMESTAMPTZ,

    -- Loyalty
    points_earned   INT DEFAULT 0,
    points_redeemed INT DEFAULT 0,

    -- Metadata
    notes           TEXT,
    is_offline      BOOLEAN DEFAULT false,         -- transaksi offline
    synced_at       TIMESTAMPTZ,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_transaction_invoice ON transactions(store_id, invoice_number);
CREATE INDEX idx_transaction_date ON transactions(store_id, transaction_date DESC);
CREATE INDEX idx_transaction_customer ON transactions(customer_id);
CREATE INDEX idx_transaction_shift ON transactions(shift_id);

-- ============================================
-- TRANSACTION ITEMS
-- ============================================
CREATE TABLE transaction_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),
    batch_number    VARCHAR(100),

    -- Quantity & Price
    quantity        DECIMAL(15,4) NOT NULL,
    unit_price      DECIMAL(15,2) NOT NULL,       -- harga jual saat transaksi
    cost_price      DECIMAL(15,2),                -- HPP saat transaksi

    -- Discounts
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount  DECIMAL(15,2) DEFAULT 0,
    discount_reason  VARCHAR(255),

    -- Tax
    tax_rate        DECIMAL(5,2) DEFAULT 0,
    tax_amount      DECIMAL(15,2) DEFAULT 0,

    -- Totals
    subtotal        DECIMAL(15,2) DEFAULT 0,      -- qty * unit_price
    total           DECIMAL(15,2) DEFAULT 0,      -- after discount + tax

    -- Status
    is_returned     BOOLEAN DEFAULT false,
    returned_qty    DECIMAL(15,4) DEFAULT 0,

    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transitems_tx ON transaction_items(transaction_id);
CREATE INDEX idx_transitems_product ON transaction_items(product_id);

-- ============================================
-- TRANSACTION DISCOUNTS (Multi-Discount per Transaction)
-- ============================================
CREATE TABLE transaction_discounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    promotion_id    UUID,                          -- jika dari promo system
    discount_type   VARCHAR(20) NOT NULL,          -- percentage, nominal
    discount_value  DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL,       -- hasil kalkulasi
    reason          VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,

    payment_method  VARCHAR(30) NOT NULL,          -- cash, debit, credit, qris, gopay, ovo, dana,
                                                    -- shopeepay, bank_transfer, credit_note, points
    payment_reference VARCHAR(100),                 -- approval code, transaction reference

    amount          DECIMAL(15,2) NOT NULL,
    cash_tendered   DECIMAL(15,2),                 -- untuk cash: uang yang diberikan
    change_amount   DECIMAL(15,2),                 -- untuk cash: kembalian

    card_type       VARCHAR(30),                   -- visa, mastercard, gpn
    card_last4      VARCHAR(4),
    card_bank       VARCHAR(100),
    card_holder     VARCHAR(255),

    ewallet_phone   VARCHAR(30),                   -- nomor yang dipakai (QRIS/e-wallet)

    status          VARCHAR(20) DEFAULT 'completed', -- completed, pending, failed, refunded
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_tx ON payments(transaction_id);

-- ============================================
-- HOLDS (Transaksi Pending / Hold)
-- ============================================
CREATE TABLE transaction_holds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    customer_id     UUID REFERENCES customers(id),
    hold_label      VARCHAR(100),                  -- kasir bisa kasih label: "Bu Ani - 3 items"

    items_data      JSONB NOT NULL,               -- snapshot data items (bisa berubah produknya)
    expires_at      TIMESTAMPTZ,                   -- auto-void kalau expired

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RETURNS / REFUND
-- ============================================
CREATE TABLE returns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id),
    store_id        UUID NOT NULL REFERENCES stores(id),
    processed_by    UUID NOT NULL REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),

    return_number   VARCHAR(50) UNIQUE NOT NULL,   -- RTN-20260617-00001
    return_date     TIMESTAMPTZ DEFAULT NOW(),
    refund_amount   DECIMAL(15,2) DEFAULT 0,
    refund_method   VARCHAR(20),                   -- cash, credit_note, original_payment

    reason          TEXT NOT NULL,
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'pending', -- pending, approved, completed, rejected
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE return_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id       UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    transaction_item_id UUID REFERENCES transaction_items(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),

    quantity        DECIMAL(15,4) NOT NULL,
    unit_price      DECIMAL(15,2) NOT NULL,       -- harga saat return
    refund_amount   DECIMAL(15,2) DEFAULT 0,

    reason          VARCHAR(255),
    condition       VARCHAR(20) DEFAULT 'good',   -- good, damaged, expired, wrong_item
    action          VARCHAR(20) DEFAULT 'restock', -- restock, dispose, return_to_supplier
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 Promotions & Vouchers

```sql
-- ============================================
-- PROMOTIONS
-- ============================================
CREATE TABLE promotions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    promo_code      VARCHAR(50) UNIQUE,            -- kode promo (opsional)

    -- Type
    promotion_type  VARCHAR(30) NOT NULL,          -- percentage_discount, nominal_discount,
                                                    -- buy_x_get_y, bundle, flash_sale
    -- Rules
    discount_percent DECIMAL(5,2),
    discount_amount  DECIMAL(15,2),
    max_discount    DECIMAL(15,2),                 -- cap diskon
    min_purchase    DECIMAL(15,2),                 -- minimum belanja
    buy_qty         INT,                           -- untuk buy X get Y
    get_qty         INT,
    get_product_id  UUID REFERENCES products(id),  -- produk gratis di buy X get Y

    -- Scope
    scope           VARCHAR(20) DEFAULT 'all',     -- all_products, specific_product, category, brand
    apply_to        JSONB,                         -- list product_id / category_id / brand_id

    -- Customer eligibility
    customer_scope  VARCHAR(20) DEFAULT 'all',     -- all, group, specific
    customer_group_ids UUID[] DEFAULT '{}',
    first_purchase  BOOLEAN DEFAULT false,         -- hanya untuk first purchase

    -- Store scope
    store_ids       UUID[] DEFAULT '{}',            -- all atau spesifik store

    -- Schedule
    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ NOT NULL,
    days_active     INT[] DEFAULT '{0,1,2,3,4,5,6}', -- hari aktif (0=Minggu)

    -- Limits
    usage_limit     INT DEFAULT 0,                 -- 0 = unlimited
    usage_per_customer INT DEFAULT 0,
    total_used      INT DEFAULT 0,

    -- Stackable
    stackable       BOOLEAN DEFAULT false,

    is_active       BOOLEAN DEFAULT true,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_code ON promotions(promo_code);

-- ============================================
-- PROMOTION USAGE
-- ============================================
CREATE TABLE promotion_usages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id    UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    transaction_id  UUID NOT NULL REFERENCES transactions(id),
    customer_id     UUID REFERENCES customers(id),
    discount_amount DECIMAL(15,2) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(promotion_id, transaction_id)
);

-- ============================================
-- VOUCHERS (Kupon)
-- ============================================
CREATE TABLE vouchers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    promotion_id    UUID REFERENCES promotions(id),

    voucher_code    VARCHAR(50) UNIQUE NOT NULL,
    voucher_type    VARCHAR(20) DEFAULT 'single',   -- single_use, multi_use, bulk

    -- Untuk bulk: generated codes
    bulk_prefix     VARCHAR(20),
    bulk_count      INT,

    discount_percent DECIMAL(5,2),
    discount_amount  DECIMAL(15,2),
    max_discount    DECIMAL(15,2),
    min_purchase    DECIMAL(15,2),

    total_quota     INT DEFAULT 1,
    used_count      INT DEFAULT 0,

    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ NOT NULL,

    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOUCHER USAGES
-- ============================================
CREATE TABLE voucher_usages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id      UUID NOT NULL REFERENCES vouchers(id),
    transaction_id  UUID NOT NULL REFERENCES transactions(id),
    customer_id     UUID REFERENCES customers(id),
    discount_amount DECIMAL(15,2) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(voucher_id, transaction_id)
);
```

### 3.7 Print & Receipt

```sql
-- ============================================
-- RECEIPT TEMPLATES
-- ============================================
CREATE TABLE receipt_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    template_type   VARCHAR(20) DEFAULT 'thermal', -- thermal, a4_invoice, digital

    -- Content
    header_text     TEXT,                          -- bisa HTML/plain
    footer_text     TEXT,
    show_logo       BOOLEAN DEFAULT true,
    show_barcode    BOOLEAN DEFAULT true,
    show_qr         BOOLEAN DEFAULT false,        -- QR code for digital receipt
    show_tax        BOOLEAN DEFAULT true,
    show_cashier    BOOLEAN DEFAULT true,

    -- Styling
    font_size       VARCHAR(10) DEFAULT 'normal',
    paper_width     VARCHAR(10) DEFAULT '80mm',   -- 58mm, 80mm, A4

    -- Default
    is_default      BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRINTER CONFIGURATION
-- ============================================
CREATE TABLE printer_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    name            VARCHAR(100) NOT NULL,         -- Kasir 1, Kasir 2, Dapur
    printer_type    VARCHAR(30) DEFAULT 'thermal', -- thermal, receipt, label, kitchen
    connection      VARCHAR(20) DEFAULT 'usb',     -- usb, network, bluetooth
    ip_address      VARCHAR(45),                   -- untuk network printer
    port            INT,
    usb_vendor_id   VARCHAR(10),
    usb_product_id  VARCHAR(10),
    paper_width     VARCHAR(10) DEFAULT '80mm',
    print_auto      BOOLEAN DEFAULT true,          -- auto print setelah transaksi
    print_copies    INT DEFAULT 1,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.8 Hardware & Config

```sql
-- ============================================
-- POS TERMINALS / DEVICES
-- ============================================
CREATE TABLE pos_terminals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    name            VARCHAR(100) NOT NULL,          -- POS Counter 1, POS Counter 2
    device_id       VARCHAR(255) UNIQUE NOT NULL,   -- hardware fingerprint / serial
    device_type     VARCHAR(30) DEFAULT 'desktop',  -- desktop, tablet, mobile

    last_seen_at    TIMESTAMPTZ,
    app_version     VARCHAR(20),
    os_version      VARCHAR(50),

    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MERCHANT SETTINGS (Global Config)
-- ============================================
CREATE TABLE merchant_settings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    setting_key     VARCHAR(100) NOT NULL,
    setting_value   JSONB NOT NULL,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, setting_key)
);

-- Default settings yang disimpan:
-- currency: "IDR"
-- language: "id"
-- timezone: "Asia/Jakarta"
-- tax_default: 11 (PPN)
-- rounding_rule: 100 (pembulatan ke atas 100 rupiah)
-- invoice_prefix: "INV"
-- receipt_footer: "Terima kasih telah berbelanja!"
-- date_format: "DD/MM/YYYY"
-- time_format: "24h"
```

### 3.9 Expense & Finance

```sql
-- ============================================
-- EXPENSE CATEGORIES
-- ============================================
CREATE TABLE expense_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,          -- Listrik, Air, Gaji, Sewa, Maintenance
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, name)
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    category_id     UUID NOT NULL REFERENCES expense_categories(id),
    created_by      UUID NOT NULL REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),

    expense_number  VARCHAR(50) UNIQUE NOT NULL,
    expense_date    DATE DEFAULT CURRENT_DATE,
    amount          DECIMAL(15,2) NOT NULL,
    receipt_url     TEXT,                          -- foto bukti
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYABLES (Hutang Supplier)
-- ============================================
CREATE TABLE payables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    supplier_id     UUID NOT NULL REFERENCES suppliers(id),
    po_id           UUID REFERENCES purchase_orders(id),

    invoice_number  VARCHAR(100),                  -- nomor invoice dari supplier
    amount          DECIMAL(15,2) NOT NULL,
    paid_amount     DECIMAL(15,2) DEFAULT 0,
    due_date        DATE,
    status          VARCHAR(20) DEFAULT 'unpaid',  -- unpaid, partially_paid, paid
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYABLE PAYMENTS
-- ============================================
CREATE TABLE payable_payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payable_id      UUID NOT NULL REFERENCES payables(id) ON DELETE CASCADE,
    amount          DECIMAL(15,2) NOT NULL,
    payment_date    DATE DEFAULT CURRENT_DATE,
    payment_method  VARCHAR(30),                   -- bank_transfer, cash, check
    reference       VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RECEIVABLES (Piutang Customer)
-- ============================================
CREATE TABLE receivables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID NOT NULL REFERENCES stores(id),
    customer_id     UUID NOT NULL REFERENCES customers(id),
    transaction_id  UUID REFERENCES transactions(id),

    amount          DECIMAL(15,2) NOT NULL,
    paid_amount     DECIMAL(15,2) DEFAULT 0,
    due_date        DATE,
    status          VARCHAR(20) DEFAULT 'unpaid',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Index Summary

```sql
-- Performance-critical composite indexes

-- Transactions: report penjualan per hari
CREATE INDEX idx_transactions_report ON transactions(store_id, status, transaction_date);

-- Inventory: cek stok real-time
CREATE INDEX idx_inventory_lookup ON inventory(store_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'));

-- Stock Movements: audit trail
CREATE INDEX idx_stock_movements_audit ON stock_movements(store_id, product_id, created_at DESC);

-- Purchase Orders: tracking
CREATE INDEX idx_po_tracking ON purchase_orders(store_id, status, created_at DESC);

-- Payments: reconciliation
CREATE INDEX idx_payments_method ON payments(payment_method, created_at DESC);

-- Audit Logs: monitoring
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);

-- Search: product name (full text)
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('indonesian', name || ' ' || COALESCE(description, '')));
```

---

## 5. Triggers & Functions

### 5.1 Auto-Update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
-- Repeat for: merchants, stores, products, product_variants, customers, suppliers,
--             transactions, purchase_orders, inventory, promotions,
-- DO $$ BEGIN ... END $$ block for all tables
```

### 5.2 Auto-Generate SKU / Invoice Number

```sql
-- Generate invoice number: INV/STORE001/20260617/00001
CREATE OR REPLACE FUNCTION generate_invoice_number(
    p_store_id UUID
) RETURNS VARCHAR AS $$
DECLARE
    v_code VARCHAR(10);
    v_date VARCHAR(8);
    v_seq  INT;
BEGIN
    SELECT code INTO v_code FROM stores WHERE id = p_store_id;
    v_date := TO_CHAR(NOW(), 'YYYYMMDD');

    SELECT COUNT(*) + 1 INTO v_seq
    FROM transactions
    WHERE store_id = p_store_id
      AND transaction_date::DATE = CURRENT_DATE;

    RETURN 'INV/' || v_code || '/' || v_date || '/' || LPAD(v_seq::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;
```

### 5.3 Auto-Update Stock on Transaction

```sql
-- Trigger setelah transaction_items di-insert: kurangi stok
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory
    SET stock_on_hand = stock_on_hand - NEW.quantity,
        updated_at = NOW()
    WHERE product_id = NEW.product_id
      AND (variant_id = NEW.variant_id OR (variant_id IS NULL AND NEW.variant_id IS NULL));

    -- Record stock movement
    INSERT INTO stock_movements (
        store_id, product_id, variant_id, user_id,
        movement_type, reference_type, reference_id,
        quantity, notes
    )
    SELECT
        t.store_id, NEW.product_id, NEW.variant_id, t.user_id,
        'sale', 'transaction', NEW.transaction_id,
        -NEW.quantity, 'Penjualan #' || t.invoice_number
    FROM transactions t WHERE t.id = NEW.transaction_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_on_sale
AFTER INSERT ON transaction_items
FOR EACH ROW EXECUTE FUNCTION update_stock_on_sale();
```

### 5.4 Low Stock Alert Check

```sql
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_on_hand <= 0 THEN
        -- Insert notification event (handled by app layer)
        -- Or raise a notice
        RAISE NOTICE 'Low stock alert: product_id=%, current_stock=%', NEW.product_id, NEW.stock_on_hand;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_low_stock_alert
AFTER UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION check_low_stock();
```

---

## 6. Seed Data

### 6.1 System Roles & Permissions

```sql
-- Insert default permissions
INSERT INTO roles (merchant_id, name, permissions, is_system) VALUES
    ('{DEFAULT_MERCHANT_ID}', 'super_admin',
     '["*"]', true),
    ('{DEFAULT_MERCHANT_ID}', 'admin_finance',
     '["dashboard.view","finance.*","report.*","tax.*","po.approve","expense.*","payable.*","receivable.*"]', true),
    ('{DEFAULT_MERCHANT_ID}', 'admin_store',
     '["dashboard.view","product.*","inventory.*","po.create","customer.*","supplier.view","promo.*","shift.*","report.view","transaction.view"]', true),
    ('{DEFAULT_MERCHANT_ID}', 'cashier',
     '["transaction.create","transaction.hold","transaction.view","customer.create","customer.view"]', true),
    ('{DEFAULT_MERCHANT_ID}', 'warehouse',
     '["inventory.*","po.receive","stock.opname","stock.transfer","product.view"]', true);
```

### 6.2 Default Tax

```sql
INSERT INTO tax_rates (merchant_id, name, rate, is_default) VALUES
    ('{DEFAULT_MERCHANT_ID}', 'Non-PPN', 0, false),
    ('{DEFAULT_MERCHANT_ID}', 'PPN 11%', 11, true);
```

### 6.3 Default Units

```sql
INSERT INTO units (merchant_id, name, symbol) VALUES
    ('{DEFAULT_MERCHANT_ID}', 'Pieces', 'pcs'),
    ('{DEFAULT_MERCHANT_ID}', 'Box', 'box'),
    ('{DEFAULT_MERCHANT_ID}', 'Karton', 'ctn'),
    ('{DEFAULT_MERCHANT_ID}', 'Lusin', 'lsn'),
    ('{DEFAULT_MERCHANT_ID}', 'Kilogram', 'kg'),
    ('{DEFAULT_MERCHANT_ID}', 'Gram', 'gr'),
    ('{DEFAULT_MERCHANT_ID}', 'Liter', 'L'),
    ('{DEFAULT_MERCHANT_ID}', 'Pack', 'pack');
```

---

## 7. Migration Strategy

| Phase | Tables | Priority |
|-------|--------|----------|
| **v1.0** (MVP) | merchants, stores, roles, users, products, categories, inventory, stock_movements, transactions, transaction_items, payments, shifts, audit_logs | P0 |
| **v1.1** | customers, customer_groups, point_transactions, suppliers, purchase_orders, purchase_order_items, goods_received | P0 |
| **v1.2** | product_variants, variant_types, variant_values, product_barcodes, transaction_holds, returns, return_items | P1 |
| **v1.3** | promotions, promotion_usages, vouchers, voucher_usages, loyalty_rewards | P1 |
| **v1.4** | expenses, expense_categories, payables, payable_payments, receivables, receipt_templates, printer_configs, pos_terminals | P2 |
| **v1.5** | advance features: consignment, multi-currency, bulk operations | P2 |

---

## 8. Estimated Data Volume (1 Year, 10 Stores)

| Table | Rows (Estimated) | Storage |
|-------|-----------------|---------|
| transactions | 1,800,000 | ~500 MB |
| transaction_items | 5,400,000 | ~400 MB |
| stock_movements | 3,000,000 | ~200 MB |
| products | 50,000 | ~50 MB |
| customers | 200,000 | ~50 MB |
| audit_logs | 10,000,000 | ~2 GB |
| **Total** | | **~3.5 GB** |

**Recommendation:** Implement table partitioning on `transactions`, `audit_logs`, and `stock_movements` by month for performance at scale.

---

*Dokumen ini terintegrasi dengan PRD KasirPro v1.0. Update sesuai dengan perubahan skema selama development.*
