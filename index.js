import express       from 'express';
import cors          from 'cors';
import cookieParser  from 'cookie-parser';

import { connectDB, sequelize } from './config/database.js';
import { initPublicModels }     from './models/initPublicModels.js';

import authRoutes               from './routes/authRoutes.js';
import tenantRoutes             from './routes/tenantRoutes.js';
import carRoutes                from './routes/carRoutes.js';
import cartypesRoutes           from './routes/cartypesRoutes.js';
import bookingRoutes            from './routes/bookingRoutes.js';
import userRoutes               from './routes/UserRoutes.js';
import userAdminRoutes          from './routes/adminUserRoutes.js';
import maintenanceRoutes        from './routes/maintenancerecordRoutes.js';
import cardamageRoutes          from './routes/cardamageRoutes.js';
import locationRoutes           from './routes/locationRoutes.js';
import locationInventoryRoutes  from './routes/locationInventoryRoutes.js';
import reviewRoutes             from './routes/reviewRoutes.js';
import carimageRoutes           from './routes/carImageRoutes.js';
import paymentRoutes            from './routes/paymentRoutes.js';

import { errorHandler }         from './middlewares/errorHandler.js';
import { tenantMiddleware }     from './middlewares/tenantMiddleware.js';
import { authenticateJWT }      from './middlewares/authenticateJWT.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerSpec.js'; // ose rruga ku e ke fajllin

const app = express();

// connect to Postgres
await connectDB();

// init public models (User, Tenant, UsersAdmin)
const publicModels = initPublicModels(sequelize);
app.set('models', publicModels);

// CORS + JSON + cookies
app.use(cors({
  origin: 'http://127.0.0.1:5500',  // <— your front-end URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ── Auth routes (login/logout/refresh) ─────────────────────────────
app.use('/api/auth', authRoutes);

// ── Public tenants listing ─────────────────────────────────────────
app.use('/api/tenants', tenantRoutes);

// ── Tenant-scoped & protected routes ──────────────────────────────
app.use('/api/cartypes',    authenticateJWT, tenantMiddleware, cartypesRoutes);
app.use('/api/car',         authenticateJWT, tenantMiddleware, carRoutes);
app.use('/api/booking',     authenticateJWT, tenantMiddleware, bookingRoutes);
app.use('/api/maintenance', authenticateJWT, tenantMiddleware, maintenanceRoutes);
app.use('/api/cardamage',   authenticateJWT, tenantMiddleware, cardamageRoutes);
app.use('/api/location',    authenticateJWT, tenantMiddleware, locationRoutes);
app.use('/api/locationInventory', authenticateJWT, tenantMiddleware, locationInventoryRoutes);
app.use('/api/review',      authenticateJWT, tenantMiddleware, reviewRoutes);
app.use('/api/carimage',    authenticateJWT, tenantMiddleware, carimageRoutes);
app.use('/api/payment',     authenticateJWT, tenantMiddleware, paymentRoutes);

// ── Protected user/admin routes ─────────────────────────────────────
app.use('/api/user', userRoutes);
app.use('/api/useradmin', authenticateJWT, userAdminRoutes);
app.use('/api/super', superAdminRoutes);

app.use('/api/super', authenticateJWT, superAdminRoutes);

// global error handler
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
