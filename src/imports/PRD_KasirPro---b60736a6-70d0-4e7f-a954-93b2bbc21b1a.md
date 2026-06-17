# Product Requirements Document (PRD)
## KasirPro — Aplikasi Point of Sale untuk Retail Skala Besar

---

| Field | Detail |
|-------|--------|
| **Nama Produk** | KasirPro |
| **Versi Dokumen** | v1.0 |
| **Status** | Draft |
| **Tanggal** | 2026-06-17 |
| **Author** | F Z (xyzysmax) |
| **Target User** | Retail besar, minimarket chain, department store, supermarket |

---

## 1. Executive Summary

KasirPro adalah aplikasi Point of Sale (POS) berbasis web & mobile yang dirancang untuk melayani toko retail skala besar dengan kapasitas **500+ transaksi per hari** dan **multi-store support**. Aplikasi ini mencakup manajemen inventori, transaksi real-time, reporting analytics, manajemen pelanggan, supplier, purchase order, payroll, dan integrasi hardware untuk memberikan pengalaman checkout yang cepat dan profesional.

**Value Proposition:**
- Checkout < 3 detik dengan barcode scanning
- Real-time sync antar cabang (Cloud-first)
- Offline mode untuk antisipasi gangguan internet
- Dashboard analytics dengan AI forecasting
- Integrasi printer thermal, barcode scanner, cash drawer, customer display

---

## 2. User Personas & Roles

### 2.1 Role Hierarchy

| Role | Level | Akses |
|------|-------|-------|
| **Super Admin** | Root | Full access — semua toko, semua modul, manajemen user, billing subscription |
| **Admin Finance** | Enterprise | Laporan keuangan, pajak, audit, cash flow, approval purchase order > threshold |
| **Admin Toko** | Store | Manajemen toko spesifik: stok, harga lokal, staff, shift, laporan harian |
| **Kasir** | Operational | POS interface, transaksi, return/refund terbatas |
| **Staff Gudang** | Operational | Stock-in, stock-out, stock opname, transfer antar toko |
| **Customer** | External | Self-checkout (opsional), loyalty point, riwayat belanja via mobile app |

### 2.2 Permission Matrix

| Modul | Super Admin | Admin Finance | Admin Toko | Kasir | Staff Gudang |
|-------|:-----------:|:-------------:|:----------:|:-----:|:------------:|
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Multi-store Config | ✅ | ❌ | ❌ | ❌ | ❌ |
| Subscription/Billing | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dashboard Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Master Barang | ✅ | ❌ | ✅ | ❌ | ❌ |
| Stok & Gudang | ✅ | ❌ | ✅ | ❌ | ✅ |
| Purchase Order | ✅ | ✅ | ✅ | ❌ | ❌ |
| Transaksi POS | ✅ | ❌ | ✅ | ✅ | ❌ |
| Refund/Return | ✅ | ❌ | ✅ | ✅ | ❌ |
| Laporan Keuangan | ✅ | ✅ | ✅ | ❌ | ❌ |
| Pajak & Tax | ✅ | ✅ | ❌ | ❌ | ❌ |
| Promo & Diskon | ✅ | ❌ | ✅ | ❌ | ❌ |
| Supplier Mgmt | ✅ | ❌ | ✅ | ❌ | ❌ |
| Customer Mgmt | ✅ | ❌ | ✅ | ✅ | ❌ |
| Audit Log | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 3. Functional Requirements

### 3.1 Autentikasi & User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | Login dengan email/phone + password | P0 |
| AUTH-02 | 2FA via OTP SMS/Email/Google Authenticator | P1 |
| AUTH-03 | SSO Google & Microsoft | P2 |
| AUTH-04 | Role-based access control (RBAC) granular | P0 |
| AUTH-05 | Session management (paksa logout, timeout otomatis) | P1 |
| AUTH-06 | Password policy (kompleksitas, expiry, history) | P1 |
| AUTH-07 | Login history & device tracking | P2 |
| AUTH-08 | PIN login untuk kasir (cepat, tanpa password) | P0 |
| AUTH-09 | Shift-based login (kasir login di awal shift) | P0 |

### 3.2 Dashboard Super Admin

| ID | Requirement | Priority |
|----|-------------|----------|
| SA-01 | Overview semua toko (aktif/non-aktif) | P0 |
| SA-02 | Real-time revenue tracker (per toko, total) | P0 |
| SA-03 | Top 10 produk (per toko, global) | P0 |
| SA-04 | Grafik penjualan harian/mingguan/bulanan/tahunan | P0 |
| SA-05 | Alert stok menipis (cross-store) | P0 |
| SA-06 | User activity monitoring (siapa login, transaksi besar) | P1 |
| SA-07 | Subscription & billing management | P1 |
| SA-08 | System health dashboard (uptime, latency, error rate) | P2 |
| SA-09 | Audit trail (semua perubahan data krusial) | P1 |
| SA-10 | Export laporan (PDF, Excel, CSV) | P0 |

### 3.3 Dashboard Admin Finance

| ID | Requirement | Priority |
|----|-------------|----------|
| FIN-01 | Revenue overview (gross, net, profit margin) | P0 |
| FIN-02 | Cash flow statement (in/out) | P0 |
| FIN-03 | Rekonsiliasi bank & kas | P1 |
| FIN-04 | Pajak report (PPN 11%, PPh) auto-generated | P0 |
| FIN-05 | Purchase order approval workflow | P0 |
| FIN-06 | Expense tracking (operational cost) | P1 |
| FIN-07 | Multi-payment method breakdown (cash, QRIS, debit, kredit, e-wallet) | P0 |
| FIN-08 | Piutang & hutang management | P1 |
| FIN-09 | Payroll integration (gaji staff per toko) | P2 |
| FIN-10 | Forecasting & budgeting tool | P2 |

### 3.4 Dashboard Admin Toko

| ID | Requirement | Priority |
|----|-------------|----------|
| TOKO-01 | Dashboard penjualan real-time toko tersebut | P0 |
| TOKO-02 | Manajemen karyawan (shift, absensi) | P0 |
| TOKO-03 | Stok overview (in/out/tersedia/dipesan) | P0 |
| TOKO-04 | Order ke supplier (Purchase Request → PO) | P0 |
| TOKO-05 | Penerimaan barang (goods received) | P0 |
| TOKO-06 | Transfer stok antar toko (request & approve) | P1 |
| TOKO-07 | Manajemen harga (harga jual, diskon lokal, promo) | P0 |
| TOKO-08 | Laporan closing harian (daily sales report) | P0 |
| TOKO-09 | Cash drawer management (opening balance, closing balance) | P0 |
| TOKO-10 | Customer complaint & return tracking | P1 |

### 3.5 Master Barang (Product Management)

| ID | Requirement | Priority |
|----|-------------|----------|
| BAR-01 | CRUD produk (nama, SKU auto-generated, deskripsi, foto) | P0 |
| BAR-02 | Multi-variant product (ukuran, warna, rasa, dll) | P0 |
| BAR-03 | Barcode management (generate, scan, multiple barcode per item) | P0 |
| BAR-04 | Kategori & sub-kategori (tree hierarchy, unlimited depth) | P0 |
| BAR-05 | Satuan & konversi (pcs, box, karton, lusin) | P0 |
| BAR-06 | Harga multi-tier (harga beli, harga jual, harga grosir, harga member) | P0 |
| BAR-07 | Markup otomatis (persentase dari harga beli) | P1 |
| BAR-08 | Batch/expiry date tracking (FEFO/FIFO) | P0 |
| BAR-09 | Minimum & maximum stock level alert | P0 |
| BAR-10 | Import/export produk via Excel/CSV | P0 |
| BAR-11 | Supplier assignment per produk | P0 |
| BAR-12 | Tax category per produk (PPN / non-PPN) | P0 |
| BAR-13 | Produk non-aktif / discontinued | P1 |

### 3.6 Inventory Management

| ID | Requirement | Priority |
|----|-------------|----------|
| INV-01 | Real-time stock update setiap transaksi | P0 |
| INV-02 | Stock-in (penerimaan dari PO, return customer, transfer) | P0 |
| INV-03 | Stock-out (penjualan, rusak, kadaluarsa, transfer keluar) | P0 |
| INV-04 | Stock opname (scheduled & ad-hoc) dengan scan barcode | P0 |
| INV-05 | Stock adjustment dengan alasan & approval | P0 |
| INV-06 | Inventory valuation (FIFO, Average) | P1 |
| INV-07 | Multi-warehouse / stock location per toko | P1 |
| INV-08 | Stock alert (low stock, overstock, dead stock) | P0 |
| INV-09 | Batch tracking (lot number, expiry) | P0 |
| INV-10 | Stock movement history & audit trail | P0 |
| INV-11 | Consignment stock management | P2 |

### 3.7 Transaksi / Point of Sale (POS)

| ID | Requirement | Priority |
|----|-------------|----------|
| POS-01 | Interface kasir cepat (barcode scan, touch-optimized) | P0 |
| POS-02 | Keranjang belanja (add, remove, qty adjust, notes) | P0 |
| POS-03 | Diskon per item & per transaksi (%) | P0 |
| POS-04 | Voucher/kupon code | P1 |
| POS-05 | Multiple payment methods (cash, debit, kredit, QRIS, e-wallet, split bill) | P0 |
| POS-06 | Kembalian auto-calculate | P0 |
| POS-07 | Hold & resume transaksi (pending) | P0 |
| POS-08 | Return/refund dengan alasan & approval | P0 |
| POS-09 | Void transaksi (butuh approval supervisior) | P0 |
| POS-10 | Struk digital (email/WA) dan print thermal | P0 |
| POS-11 | Struk custom (logo, header, footer, font, kolom) | P0 |
| POS-12 | Barcode scan → auto add to cart | P0 |
| POS-13 | Weight scale integration (timbangan digital) | P1 |
| POS-14 | Customer display (second screen for customer) | P1 |
| POS-15 | Loyalty point auto-apply | P1 |
| POS-16 | Credit note & store credit | P1 |
| POS-17 | Pembulatan otomatis (rounding rules) | P1 |
| POS-18 | Offline mode (transaksi tetap jalan, sync pas online) | P0 |
| POS-19 | Queue management / nomor antrian | P2 |
| POS-20 | Split bill / patungan transaksi | P1 |

### 3.8 Customer Management (CRM)

| ID | Requirement | Priority |
|----|-------------|----------|
| CRM-01 | Register customer (nama, phone, email, alamat) | P0 |
| CRM-02 | Customer group/tier (regular, member, VIP) | P1 |
| CRM-03 | Loyalty program (poin, rewards, tier upgrade) | P0 |
| CRM-04 | Riwayat transaksi per customer | P0 |
| CRM-05 | Piutang customer (credit sale) | P1 |
| CRM-06 | Birthday auto-promo | P2 |
| CRM-07 | Customer import via Excel | P1 |
| CRM-08 | Customer tagging & segmentasi | P2 |
| CRM-09 | Send promo via WhatsApp/Email blast | P2 |

### 3.9 Supplier Management

| ID | Requirement | Priority |
|----|-------------|----------|
| SUP-01 | CRUD supplier (nama, kontak, alamat, NPWP, payment terms) | P0 |
| SUP-02 | Daftar harga supplier per produk | P0 |
| SUP-03 | Riwayat purchase order per supplier | P0 |
| SUP-04 | Hutang supplier tracking | P1 |
| SUP-05 | Supplier rating & performance | P2 |
| SUP-06 | Konsinyasi (consignment) management | P2 |

### 3.10 Purchase Order (PO)

| ID | Requirement | Priority |
|----|-------------|----------|
| PO-01 | Create PO (auto-suggest dari low stock) | P0 |
| PO-02 | Approval workflow (Admin Toko → Admin Finance) | P0 |
| PO-03 | PO status tracking (draft → approved → ordered → received → paid) | P0 |
| PO-04 | Goods received note (GRN) — scan barcode pas barang datang | P0 |
| PO-05 | Partial delivery handling | P1 |
| PO-06 | PO revision & versioning | P1 |
| PO-07 | Auto-generate PO dari reorder point | P1 |
| PO-08 | Supplier price comparison | P2 |

### 3.11 Laporan & Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| LAP-01 | Laporan penjualan harian (daily sales report) | P0 |
| LAP-02 | Laporan penjualan per produk / kategori / brand | P0 |
| LAP-03 | Laporan penjualan per kasir | P1 |
| LAP-04 | Laporan penjualan per jam (peak hours) | P1 |
| LAP-05 | Laporan profit & loss (P&L) | P0 |
| LAP-06 | Laporan stok (current, movement, valuation) | P0 |
| LAP-07 | Laporan pajak (PPN, PPh) | P0 |
| LAP-08 | Laporan hutang piutang | P0 |
| LAP-09 | Laporan cash flow | P0 |
| LAP-10 | Laporan best & slow moving products | P0 |
| LAP-11 | Export semua laporan (PDF, Excel, CSV) | P0 |
| LAP-12 | Scheduled report (auto-email setiap pagi/minggu) | P1 |
| LAP-13 | Custom report builder (pilih kolom, filter, group) | P2 |

### 3.12 Payment & Finance

| ID | Requirement | Priority |
|----|-------------|----------|
| PAY-01 | Multi-payment: Cash, Debit, Kredit (EDC integration) | P0 |
| PAY-02 | QRIS payment integration | P0 |
| PAY-03 | E-wallet (GoPay, OVO, Dana, ShopeePay) | P1 |
| PAY-04 | Split payment (1 transaksi dibayar beberapa metode) | P0 |
| PAY-05 | Cash drawer management (open, count, close) | P0 |
| PAY-06 | Deposit / uang muka | P1 |
| PAY-07 | Cicilan / installment | P2 |
| PAY-08 | Multi-currency | P2 |

### 3.13 Print & Receipt

| ID | Requirement | Priority |
|----|-------------|----------|
| PRN-01 | Print struk thermal (58mm & 80mm) | P0 |
| PRN-02 | Struk custom template (logo, header, footer, info toko) | P0 |
| PRN-03 | Reprint struk (dengan watermark "DUPLICATE") | P0 |
| PRN-04 | Print barcode label | P1 |
| PRN-05 | Print invoice A4 | P1 |
| PRN-06 | Struk digital (WhatsApp / Email) | P1 |
| PRN-07 | Multiple printer support (kasir + dapur, dll) | P1 |
| PRN-08 | Auto-print setelah transaksi (tanpa klik) | P1 |

### 3.14 Shift Management

| ID | Requirement | Priority |
|----|-------------|----------|
| SHF-01 | Buka shift (opening balance, catat uang di drawer) | P0 |
| SHF-02 | Tutup shift (closing balance, rekap transaksi, selisih) | P0 |
| SHF-03 | Shift report (jumlah transaksi, total, metode pembayaran) | P0 |
| SHF-04 | Serah terima shift (handover antar kasir) | P0 |
| SHF-05 | Multi-shift schedule (pagi, siang, malam) | P1 |

### 3.15 Promo & Diskon

| ID | Requirement | Priority |
|----|-------------|----------|
| PMO-01 | Diskon % per item / per transaksi | P0 |
| PMO-02 | Diskon nominal (Rp) per transaksi | P0 |
| PMO-03 | Buy X Get Y (bundling) | P1 |
| PMO-04 | Diskon member / tier spesifik | P1 |
| PMO-05 | Promo terjadwal (tanggal mulai & selesai) | P0 |
| PMO-06 | Promo minimum purchase | P0 |
| PMO-07 | Kupon / voucher code (single use, multi use) | P1 |
| PMO-08 | Flash sale (kuota terbatas) | P2 |
| PMO-09 | Diskon berdasarkan jam / hari | P1 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PRF-01 | Checkout time (scan → print) | < 3 detik |
| PRF-02 | Response time API | < 200ms (P95) |
| PRF-03 | Concurrent users (per toko) | 50+ |
| PRF-04 | Concurrent users (total sistem) | 1000+ |
| PRF-05 | Database query | < 100ms (P95) |
| PRF-06 | Auto-sync antar cabang | < 5 detik |
| PRF-07 | Startup/load time (SPA) | < 2 detik |

### 4.2 Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| AVL-01 | Uptime | 99.9% (SLA) |
| AVL-02 | Offline mode | Transaksi tetap berjalan tanpa internet |
| AVL-03 | Data backup | Auto backup setiap 1 jam |
| AVL-04 | Disaster recovery | RPO < 1 jam, RTO < 4 jam |
| AVL-05 | Graceful degradation | Fitur non-kritikal mati, POS tetap jalan |

### 4.3 Security

| ID | Requirement |
|----|-------------|
| SEC-01 | HTTPS/TLS 1.3 untuk semua komunikasi |
| SEC-02 | Data encryption at rest (AES-256) |
| SEC-03 | JWT + refresh token untuk API auth |
| SEC-04 | Rate limiting (mencegah brute force) |
| SEC-05 | SQL injection prevention (parameterized queries) |
| SEC-06 | XSS & CSRF protection |
| SEC-07 | Input validation (server-side) |
| SEC-08 | Role-based access control di API level |
| SEC-09 | Audit log (semua create, update, delete) |
| SEC-10 | PCI DSS compliance (untuk payment card data) |
| SEC-11 | Data anonymization untuk report & testing |

### 4.4 Scalability

| ID | Requirement |
|----|-------------|
| SCL-01 | Horizontal scaling (auto-scale worker nodes) |
| SCL-02 | Database read replicas untuk report query |
| SCL-03 | Message queue untuk sync antar cabang |
| SCL-04 | CDN untuk asset statis (gambar produk, dll) |
| SCL-05 | Multi-tenant architecture (isolated per merchant) |

### 4.5 Compatibility

| ID | Requirement |
|----|-------------|
| CMP-01 | Web: Chrome, Firefox, Edge (latest 2 versions) |
| CMP-02 | Mobile: Android 8+, iOS 14+ |
| CMP-03 | Printer: Epson, Brother, Star (ESC/POS) |
| CMP-04 | Barcode scanner: USB HID, Bluetooth |
| CMP-05 | Cash drawer: trigger via printer |
| CMP-06 | Customer display: VFD/LCD second monitor |
| CMP-07 | Weighing scale: RS-232 / USB |

---

## 5. Technical Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├────────────┬────────────┬────────────┬──────────────────┤
│ Web App    │ Mobile     │ POS        │ Customer App     │
│ (React)    │ (Flutter)  │ Terminal   │ (Flutter)        │
│            │ Admin      │ (Electron) │                  │
└────────────┴────────────┴────────────┴──────────────────┘
                            │
                    HTTPS / WSS
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    API GATEWAY                           │
│              (Kong / Nginx + Auth)                       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                 MICROSERVICES                            │
├────────┬────────┬────────┬────────┬────────┬────────────┤
│ Auth   │Product │Inventory│ POS   │Finance │Report      │
│Service │Service │Service  │Service│Service │Service     │
└────────┴────────┴────────┴────────┴────────┴────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │PostgreSQL│ │  Redis   │ │   RabbitMQ   │
        │(Primary) │ │ (Cache)  │ │ (Message Q)  │
        └──────────┘ └──────────┘ └──────────────┘
              │
        ┌─────┴─────┐
        ▼           ▼
  ┌──────────┐ ┌──────────┐
  │ Read     │ │ S3/MinIO │
  │ Replica  │ │ (Images) │
  └──────────┘ └──────────┘
```

**Tech Stack Recommendation:**
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Zustand
- **POS Terminal:** Electron + React (untuk integrasi hardware)
- **Mobile:** Flutter (iOS & Android)
- **Backend:** Go (Golang) / Node.js (NestJS) — high performance
- **Database:** PostgreSQL 15 + TimescaleDB (time-series untuk analytics)
- **Cache:** Redis (session, rate limit, real-time counter)
- **Queue:** RabbitMQ / NATS
- **Storage:** MinIO / S3 (gambar produk, struk digital)
- **Search:** Elasticsearch (pencarian produk cepat)
- **Container:** Docker + Kubernetes
- **CI/CD:** GitHub Actions / GitLab CI
- **Monitoring:** Grafana + Prometheus + Sentry

---

## 6. Data Model (Key Entities)

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Merchant │────→│   Store  │────→│    User      │
│ (tenant) │     │ (cabang) │     │ (karyawan)   │
└──────────┘     └────┬─────┘     └──────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Product  │ │Inventory │ │ Customer │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
              ┌──────────────┐
              │ Transaction  │
              │   (POS)      │
              └──────┬───────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Payment  │ │Trans Item│ │  Shift   │
  └──────────┘ └──────────┘ └──────────┘

Supporting entities:
- PurchaseOrder → PO_Items → GoodsReceived
- Promotion → PromotionRule → PromotionUsage
- Supplier → SupplierPrice
- LoyaltyPoint → PointTransaction
- AuditLog
```

---

## 7. User Stories (MVP)

### Sprint 1: Core POS (Week 1-4)
1. Sebagai **kasir**, saya bisa login dengan PIN 4-digit dengan cepat
2. Sebagai **kasir**, saya bisa scan barcode dan produk otomatis masuk keranjang
3. Sebagai **kasir**, saya bisa menerima pembayaran cash dan menghitung kembalian
4. Sebagai **kasir**, saya bisa print struk thermal secara otomatis
5. Sebagai **admin toko**, saya bisa melihat dashboard penjualan real-time

### Sprint 2: Inventory (Week 5-8)
1. Sebagai **admin toko**, saya bisa menambah, edit, hapus produk dengan foto & barcode
2. Sebagai **admin toko**, saya bisa melihat stok real-time per produk
3. Sebagai **staff gudang**, saya bisa melakukan stock-in dari PO
4. Sebagai **staff gudang**, saya bisa melakukan stock opname dengan scan barcode
5. Sebagai **admin toko**, saya bisa menerima notifikasi stok menipis

### Sprint 3: Multi-Payment & Finance (Week 9-12)
1. Sebagai **kasir**, saya bisa menerima pembayaran debit/kredit via EDC
2. Sebagai **kasir**, saya bisa menerima pembayaran QRIS
3. Sebagai **kasir**, saya bisa split payment dalam 1 transaksi
4. Sebagai **admin finance**, saya bisa melihat laporan keuangan harian
5. Sebagai **admin finance**, saya bisa export laporan pajak

### Sprint 4: Customer & Loyalty (Week 13-16)
1. Sebagai **kasir**, saya bisa attach customer ke transaksi
2. Sebagai **customer**, saya bisa mengumpulkan poin loyalty
3. Sebagai **admin toko**, saya bisa membuat program promo & diskon
4. Sebagai **admin toko**, saya bisa mengirim struk digital ke WhatsApp customer

### Sprint 5: Multi-Store & Scale (Week 17-20)
1. Sebagai **super admin**, saya bisa manage multiple toko
2. Sebagai **admin toko**, saya bisa request transfer stok antar toko
3. Sebagai **super admin**, saya bisa melihat consolidated report semua toko
4. Sebagai **admin toko**, saya bisa mengelola shift & absensi karyawan

### Sprint 6: Advanced Features (Week 21-24)
1. Sebagai **admin finance**, saya bisa approval purchase order
2. Sebagai **admin toko**, saya bisa membuat PO otomatis dari reorder point
3. Sebagai **super admin**, saya bisa mengatur subscription & billing
4. Sebagai **kasir**, POS tetap bisa digunakan dalam mode offline

---

## 8. Integration Requirements

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Payment Gateway (Midtrans/Xendit) | Debit, Kredit, QRIS, e-wallet | P0 |
| EDC Machine (BCA, Mandiri, BRI) | Kartu debit/kredit | P0 |
| WhatsApp Business API | Struk digital, blast promo | P1 |
| Email (SMTP/SendGrid) | Struk digital, report | P1 |
| SMS Gateway | OTP, notifikasi | P2 |
| Google Maps API | Alamat customer, toko | P2 |
| Accounting Software (Jurnal, Accurate) | Export data ke akuntansi | P2 |
| e-Faktur Pajak (DJP) | Auto-generate faktur pajak | P1 |
| Loyalty Platform | Integrasi poin eksternal | P2 |

---

## 9. Hardware Specifications (Minimum)

| Hardware | Spec |
|----------|------|
| **POS Terminal** | Intel i3, 8GB RAM, 128GB SSD, Windows 10/11 |
| **Tablet POS** | Android 8+, 4GB RAM, 10" screen |
| **Barcode Scanner** | USB 2D barcode scanner (Zebra, Honeywell) |
| **Thermal Printer** | 80mm ESC/POS (Epson TM-T88, Brother) |
| **Cash Drawer** | RJ11 trigger from printer |
| **Customer Display** | VFD 2x20 or LCD second monitor |
| **Network** | Minimum 10 Mbps, backup 4G modem |
| **Server (self-host)** | 8 Core, 32GB RAM, 500GB SSD, Ubuntu 22.04 |

---

## 10. Success Metrics (KPI)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Average transaction time | < 30 detik | Dari scan item pertama → print struk |
| System uptime | 99.9% | Monthly monitoring |
| Stock accuracy | > 99% | Stock opname variance |
| Cash drawer accuracy | 100% | Closing balance = opening + sales - expenses |
| Customer satisfaction | > 4.5/5 | Survey in-app |
| Report generation time | < 10 detik | Waktu load laporan bulanan |
| Time to onboard new store | < 1 hari | Setup sampai operasional |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Internet mati di toko | Tidak bisa transaksi | Offline mode, sync queue |
| Server down | Semua toko berhenti | Multi-AZ deployment, auto-failover |
| Data corrupt / hilang | Kehilangan transaksi | Auto backup, WAL archiving |
| Serangan siber / breach | Data customer bocor | WAF, regular pentest, encryption |
| Printer / hardware rusak | Tidak bisa print struk | Struk digital fallback, spare hardware |
| Human error (kasir salah input) | Selisih keuangan | Multi-step confirmation, audit trail |
| Supplier tidak kirim sesuai PO | Stok kosong | Multi-supplier per produk, safety stock |

---

## 12. Development Timeline (Estimasi)

```
Bulan 1-2:   Setup infra, CI/CD, auth system, multi-tenant
Bulan 3-4:   Core POS module, product master, barcode management
Bulan 5-6:   Inventory, stock management, purchase order
Bulan 7-8:   Payment integration, finance dashboard, tax report
Bulan 9-10:  Customer management, loyalty, promo engine
Bulan 11-12: Multi-store, shift management, offline mode
Bulan 13-14: Mobile app (admin + customer), hardware integration
Bulan 15-16: Load testing, security audit, pilot launch
Bulan 17-18: Production launch, monitoring, iteration
```

**Total: ~18 bulan dengan tim 8-12 orang (4 BE, 3 FE, 1 DevOps, 1 QA, 1 PM, 1 UI/UX)**

---

## 13. Appendix

### A. Glossary
| Term | Definition |
|------|------------|
| POS | Point of Sale — sistem kasir |
| SKU | Stock Keeping Unit — kode unik produk |
| GRN | Goods Received Note — bukti terima barang |
| PO | Purchase Order — pesanan ke supplier |
| FEFO | First Expired First Out — barang kadaluarsa duluan keluar duluan |
| FIFO | First In First Out |
| EDC | Electronic Data Capture — mesin gesek kartu |
| ESC/POS | Epson Standard Code for POS — protokol printer thermal |
| RBAC | Role-Based Access Control |

### B. Open Questions
1. Self-hosted vs Cloud SaaS? (mempengaruhi pricing model)
2. Single merchant atau multi-merchant (B2B SaaS)?
3. Integrasi ke sistem akuntansi spesifik (Jurnal.id, Accurate, SAP)?
4. Support multi-bahasa (Indonesia + Inggris)?
5. White-label untuk reseller?

---

*Dokumen ini bersifat living document. Update sesuai development progress & feedback stakeholder.*
