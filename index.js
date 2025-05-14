  import express from "express";
  import cors from "cors";
  const app = express();
  import {connectDB,sequelize} from "./config/database.js"
  import tenantRoutes from "./routes/tenantRoutes.js";
  import carRoutes from "./routes/carRoutes.js"; 
  import cartypesRoutes from "./routes/cartypesRoutes.js";
  import bookingRoutes from "./routes/bookingRoutes.js";
  import userRoutes from "./routes/UserRoutes.js";
  import userAdminRoutes from "./routes/adminUserRoutes.js";
  import authRoutes from "./routes/authRoutes.js";
  import maintenanceRoutes from './routes/maintenancerecordRoutes.js';
  import cardamageRoutes from './routes/cardamageRoutes.js';
  import locationRoutes from "./routes/locationRoutes.js";
  import locationInventoryRoutes from "./routes/locationInventoryRoutes.js";
  import reviewRoutes from "./routes/reviewRoutes.js";
  import carimageRoutes from "./routes/carImageRoutes.js";
  import paymentRoutes from "./routes/paymentRoutes.js";



    connectDB();
    app.use(cors());
    
    app.use(express.json());

  app.use('/api/tenants',tenantRoutes)
  app.use('/api/car',carRoutes)
  app.use('/api/cartypes',cartypesRoutes)
  app.use('/api/booking',bookingRoutes)
  app.use('/api/user', userRoutes);
  app.use('/api/useradmin', userAdminRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/maintenance', maintenanceRoutes);
  app.use('/api/cardamage', cardamageRoutes);
  app.use('/api/location', locationRoutes);
  app.use('/api/locationInventory', locationInventoryRoutes);
  app.use('/api/review', reviewRoutes);
  app.use('/api/carimage', carimageRoutes);
  app.use('/api/payment', paymentRoutes);

  app.listen(3000, ()=> {
      console.log("Server running on port 3000");
      sequelize.sync().then(() => console.log("Database synced!!"));
  });