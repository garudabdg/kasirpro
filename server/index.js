import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prismaClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KasirPro API is running' });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        unit: true,
        inventories: true,
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Delete Product API
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET Single Product API
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, inventories: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update Product API
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, stock, sellingPrice, costPrice, barcode } = req.body;
    
    const merchant = await prisma.merchant.findFirst();
    let categoryRecord = null;
    if (category) {
      categoryRecord = await prisma.category.findFirst({
        where: { merchant_id: merchant.id, slug: category }
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        barcode: barcode || null,
        selling_price: sellingPrice,
        cost_price: costPrice,
        ...(categoryRecord && { category_id: categoryRecord.id }),
      }
    });

    const inventory = await prisma.inventory.findFirst({ where: { product_id: id } });
    if (inventory) {
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { stock_on_hand: stock }
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Create Product API
app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, category, stock, sellingPrice, costPrice, barcode } = req.body;
    
    // Get default merchant and store (for single-tenant local usage)
    const merchant = await prisma.merchant.findFirst();
    const store = await prisma.store.findFirst();
    
    if (!merchant || !store) {
      return res.status(400).json({ error: 'System not properly initialized. Run seed first.' });
    }

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: { merchant_id: merchant.id, slug: category }
    });
    
    if (!categoryRecord && category) {
      categoryRecord = await prisma.category.create({
        data: {
          merchant_id: merchant.id,
          name: category,
          slug: category.toLowerCase().replace(/ /g, '-'),
        }
      });
    }

    // Create Product
    const product = await prisma.product.create({
      data: {
        merchant_id: merchant.id,
        category_id: categoryRecord ? categoryRecord.id : null,
        name,
        sku,
        barcode: barcode || null,
        selling_price: sellingPrice || 0,
        cost_price: costPrice || 0,
      }
    });

    // Create Inventory
    await prisma.inventory.create({
      data: {
        store_id: store.id,
        product_id: product.id,
        stock_on_hand: stock || 0,
      }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Create Transaction API
app.post('/api/transactions', async (req, res) => {
  try {
    const { items, paymentMethod, paymentAmount, subtotal, discount, tax, grandTotal } = req.body;
    
    // Get store
    const store = await prisma.store.findFirst();
    if (!store) {
      return res.status(400).json({ error: 'System not properly initialized. Run seed first.' });
    }

    // Generate Invoice Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.transaction.count({
      where: { transaction_date: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    });
    const invoice_number = `INV/${dateStr}/${String(count + 1).padStart(4, '0')}`;

    // Create transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        store_id: store.id,
        invoice_number,
        subtotal: subtotal || 0,
        discount_total: discount || 0,
        tax_total: tax || 0,
        grand_total: grandTotal || 0,
        paid_amount: paymentAmount || grandTotal || 0,
        change_amount: Math.max(0, (paymentAmount || 0) - (grandTotal || 0)),
        payment_method: paymentMethod || 'cash',
        items: {
          create: items.map(item => ({
            product_id: item.id,
            quantity: item.qty,
            unit_price: item.price || 0,
            subtotal: (item.price || 0) * item.qty
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Update inventory (deduct stock)
    for (const item of items) {
      const inventory = await prisma.inventory.findFirst({
        where: { store_id: store.id, product_id: item.id }
      });
      if (inventory) {
        await prisma.inventory.update({
          where: { id: inventory.id },
          data: {
            stock_on_hand: {
              decrement: item.qty
            }
          }
        });
      }
    }

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// GET Transactions API
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
