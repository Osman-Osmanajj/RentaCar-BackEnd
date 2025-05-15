import express  from 'express';
import cors     from 'cors';

import { connectDB, sequelize } from './config/database.js';
import { initPublicModels }     from './models/initPublicModels.js';
import { initTenantModels }     from './models/initTenantModels.js';

import tenantRoutes           from './routes/tenantRoutes.js';
import carRoutes              from './routes/carRoutes.js';
import cartypesRoutes         from './routes/cartypesRoutes.js';
import bookingRoutes          from './routes/bookingRoutes.js';
import userRoutes             from './routes/UserRoutes.js';
import userAdminRoutes        from './routes/adminUserRoutes.js';
import authRoutes             from './routes/authRoutes.js';

import maintenanceRoutes      from './routes/maintenancerecordRoutes.js';
import cardamageRoutes        from './routes/cardamageRoutes.js';
import locationRoutes         from './routes/locationRoutes.js';
import locationInventoryRoutes from './routes/locationInventoryRoutes.js';
import reviewRoutes           from './routes/reviewRoutes.js';
import carimageRoutes         from './routes/carImageRoutes.js';
import paymentRoutes          from './routes/paymentRoutes.js';

import { errorHandler } from './middlewares/errorHandler.js';
import {tenantMiddleware} from './middlewares/tenantMiddleware.js';
const app = express();

await connectDB();                            
const publicModels = initPublicModels(sequelize);
app.set('models', publicModels);               

app.use(cors());
app.use(express.json());



app.use('/api/tenants',   tenantRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api/user',      userRoutes);
app.use('/api/useradmin', userAdminRoutes);

app.use('/api/car',              tenantMiddleware, carRoutes);
app.use('/api/cartypes',         tenantMiddleware, cartypesRoutes);
app.use('/api/booking',          tenantMiddleware, bookingRoutes);
app.use('/api/maintenance',      tenantMiddleware, maintenanceRoutes);
app.use('/api/cardamage',        tenantMiddleware, cardamageRoutes);
app.use('/api/location',         tenantMiddleware, locationRoutes);
app.use('/api/locationInventory',tenantMiddleware, locationInventoryRoutes);
app.use('/api/review',           tenantMiddleware, reviewRoutes);
app.use('/api/carimage',         tenantMiddleware, carimageRoutes);
app.use('/api/payment',          tenantMiddleware, paymentRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
