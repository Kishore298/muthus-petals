import mongoose from 'mongoose';
import dns from "node:dns";

// Force Node.js to use public DNS servers to resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const oldDbUri = "mongodb+srv://vicky:test123@cluster0.epdrsry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const newDbUri = "mongodb+srv://wwwsupeeme7828_db_user:LLSo2b4bS2CKXd4D@cluster0.wquozfi.mongodb.net/";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  pin: { type: String },
  country: { type: String },
  orderItems: [{
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    image: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    size: { type: String },
    color: { type: String }
  }],
  shippingCharge: { type: Number, default: 0 },
  totalprice: { type: Number },
  orderStatus: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
}, { strict: false });

async function migrate() {
  try {
    const oldConn = await mongoose.createConnection(oldDbUri).asPromise();
    console.log("Connected to old DB");

    // We should figure out the db names for old Db if not specified. By default it connects to `test` if none is in URL. Let's list collections and pick the one with orders.
    // Wait, the new db URI is just cluster0.wquozfi.mongodb.net/. Usually it's `petals` or something.
    // I should get the orders from oldConn.
    const OldOrder = oldConn.model('Order', orderSchema, 'orders'); // Assumes collection name is 'orders'
    const orders = await OldOrder.find().lean();
    console.log(`Found ${orders.length} orders in old DB`);

    const newConn = await mongoose.createConnection(newDbUri).asPromise();
    console.log("Connected to new DB");
    const NewOrder = newConn.model('Order', orderSchema, 'orders');

    for (const order of orders) {
      // Check if it already exists
      const exists = await NewOrder.findById(order._id);
      if (!exists) {
        await NewOrder.create(order);
      }
    }
    console.log("Migration completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
