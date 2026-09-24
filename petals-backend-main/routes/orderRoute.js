import express from 'express';
import { createorder, getsingleorder, myorder, orders, updateorder, deleteorder } from '../controllers/orderController.js'; // Adjusted import statement
import { isauthticateuser, authorizeRoles } from '../middlewares/Authenticate.js';

const routes = express.Router();

routes.post('/order/new', createorder);

routes.get('/order/:id', getsingleorder);
routes.get('/myorder', myorder);

// Admin routes
routes.get('/admin/orders', isauthticateuser, authorizeRoles('admin'), orders);
routes.put('/admin/order/:id', isauthticateuser, authorizeRoles('admin'), updateorder);
routes.delete('/admin/order/:id', isauthticateuser, authorizeRoles('admin'), deleteorder);

routes.get('/migrate-orders', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const oldDbUri = "mongodb+srv://vicky:test123@cluster0.epdrsry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const oldConn = await mongoose.createConnection(oldDbUri).asPromise();
    
    const db = oldConn.db;
    const collections = await db.listCollections().toArray();
    
    // Find the one that has orders
    let oldOrders = [];
    let usedCol = '';
    for (const c of collections) {
      if (c.name.toLowerCase().includes('order')) {
        const orderDocs = await db.collection(c.name).find().toArray();
        if (orderDocs.length > 0) {
          oldOrders = oldOrders.concat(orderDocs);
          usedCol += c.name + ' ';
        }
      }
    }
    
    const orderSchema = new mongoose.Schema({}, { strict: false });
    const NewOrder = mongoose.connection.model('bOrder', orderSchema, 'borders');
    
    let added = 0;
    for (const order of oldOrders) {
      const exists = await NewOrder.findById(order._id);
      if (!exists) {
        await NewOrder.create(order);
        added++;
      }
    }
    oldConn.close();
    res.json({ message: `Migration successful. Found collections: ${usedCol}. Added ${added} orders.` });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

export default routes;
