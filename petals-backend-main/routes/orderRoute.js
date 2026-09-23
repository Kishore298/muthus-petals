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

export default routes;
