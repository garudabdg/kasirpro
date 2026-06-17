import prisma from './prismaClient.js';

async function main() {
  console.log('Seeding database...');

  // 1. Create a Merchant
  const merchant = await prisma.merchant.upsert({
    where: { slug: 'kasirpro-retail' },
    update: {},
    create: {
      name: 'KasirPro Retail',
      slug: 'kasirpro-retail',
      email: 'hello@kasirpro.id',
    },
  });

  // 2. Create a Store
  const store = await prisma.store.upsert({
    where: { merchant_id_code: { merchant_id: merchant.id, code: 'STORE-001' } },
    update: {},
    create: {
      merchant_id: merchant.id,
      code: 'STORE-001',
      name: 'Cabang Utama Jakarta',
      address: 'Jl. Teknologi No. 123, Jakarta',
    },
  });

  // 3. Create Categories
  const categories = [
    { name: 'Makanan', slug: 'food' },
    { name: 'Minuman', slug: 'drink' },
    { name: 'Kebutuhan Rumah', slug: 'household' },
    { name: 'Snack', slug: 'snack' }
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { merchant_id_slug: { merchant_id: merchant.id, slug: cat.slug } },
      update: {},
      create: {
        merchant_id: merchant.id,
        name: cat.name,
        slug: cat.slug,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  // 4. Create Products
  const mockProducts = [
    { name: 'Indomie Goreng', price: 3500, category: 'food', stock: 150, sku: 'PROD-001' },
    { name: 'Aqua 600ml', price: 3000, category: 'drink', stock: 200, sku: 'PROD-002' },
    { name: 'Beras Premium 5kg', price: 68000, category: 'food', stock: 50, sku: 'PROD-003' },
    { name: 'Minyak Goreng 2L', price: 34000, category: 'household', stock: 75, sku: 'PROD-004' },
    { name: 'Susu UHT Coklat 1L', price: 18000, category: 'drink', stock: 120, sku: 'PROD-005' },
    { name: 'Kopi Sachet', price: 15000, category: 'drink', stock: 300, sku: 'PROD-006' },
    { name: 'Snack Kentang 68g', price: 12000, category: 'snack', stock: 80, sku: 'PROD-007' },
    { name: 'Shampo Botol 170ml', price: 25000, category: 'household', stock: 45, sku: 'PROD-008' },
    { name: 'Sabun Mandi Cair 400ml', price: 22000, category: 'household', stock: 60, sku: 'PROD-009' },
    { name: 'Roti Tawar', price: 16000, category: 'food', stock: 20, sku: 'PROD-010' },
    { name: 'Teh Pucuk 350ml', price: 4000, category: 'drink', stock: 180, sku: 'PROD-011' },
    { name: 'Biskuit Coklat', price: 10000, category: 'snack', stock: 95, sku: 'PROD-012' },
  ];

  for (const p of mockProducts) {
    const product = await prisma.product.upsert({
      where: { merchant_id_sku: { merchant_id: merchant.id, sku: p.sku } },
      update: {},
      create: {
        merchant_id: merchant.id,
        category_id: categoryMap[p.category],
        name: p.name,
        sku: p.sku,
        selling_price: p.price,
      },
    });

    // Create inventory for the product
    await prisma.inventory.upsert({
      where: {
        store_id_product_id_variant_id_batch_number: {
          store_id: store.id,
          product_id: product.id,
          variant_id: '00000000-0000-0000-0000-000000000000', // Mock empty variant if your unique key requires it, wait no, it's optional but unique might be tricky
          batch_number: ''
        }
      },
      update: {
        stock_on_hand: p.stock
      },
      create: {
        store_id: store.id,
        product_id: product.id,
        stock_on_hand: p.stock,
      }
    }).catch(async (e) => {
       // if unique fails due to nulls in variant_id, let's just do a first/create
       const inv = await prisma.inventory.findFirst({
         where: { store_id: store.id, product_id: product.id }
       });
       if (!inv) {
         await prisma.inventory.create({
           data: {
             store_id: store.id,
             product_id: product.id,
             stock_on_hand: p.stock,
           }
         });
       } else {
         await prisma.inventory.update({
           where: { id: inv.id },
           data: { stock_on_hand: p.stock }
         })
       }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
