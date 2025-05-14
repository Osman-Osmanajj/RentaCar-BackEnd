/* ─────────────────────────────────────────────
 *  index.js   – single Sequelize instance,
 *               public-model bootstrap,
 *               tenant-model middleware
 * ──────────────────────────────────────────── */
import express  from 'express';
import cors     from 'cors';


import { connectDB, sequelize }   from './config/database.js';
import { initPublicModels }       from './models/initPublicModels.js';
import { initTenantModels }       from './models/initTenantModels.js';

import tenantRoutes     from './routes/tenantRoutes.js';
import carRoutes        from './routes/carRoutes.js';
import cartypesRoutes   from './routes/cartypesRoutes.js';
import bookingRoutes    from './routes/bookingRoutes.js';
import userRoutes       from './routes/UserRoutes.js';
import userAdminRoutes  from './routes/adminUserRoutes.js';
import authRoutes       from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();


await connectDB();                              
const publicModels = initPublicModels(sequelize);
app.set('models', publicModels);                


async function tenantMiddleware(req, res, next) {
  const tenantId = req.header('X-Tenant-ID');
  if (!tenantId) return res.status(400).json({ error: 'Missing X-Tenant-ID header' });

  try {
    const { Tenant } = req.app.get('models');
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    req.tenantModels = initTenantModels(tenant.schema_name);
    next();
  } catch (err) {
    next(err);
  }
}


app.use(cors());
app.use(express.json());

// public-schema routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/user',    userRoutes);
app.use('/api/useradmin', userAdminRoutes);

// tenant-scoped routes (pass through tenantMiddleware)
app.use('/api/car',      tenantMiddleware, carRoutes);
app.use('/api/cartypes', tenantMiddleware, cartypesRoutes);
app.use('/api/booking',  tenantMiddleware, bookingRoutes);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});