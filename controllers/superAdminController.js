import { initTenantModels } from '../models/initTenantModels.js';

class SuperAdminController {
  // ─── GET ALL TENANTS ─────────────────────────────────────────────────────
  async getAllTenants(req, res, next) {
    try {
      const { Tenant } = req.app.get('models');
      const tenants = await Tenant.findAll();
      return res.json({ tenants });
    } catch (err) {
      next(err);
    }
  }

// ─── CREATE TENANT ───────────────────────────────────────────────────────
async createTenant(req, res, next) {
  try {
    const { name, email, phone, address, city, country } = req.body;
    const { Tenant } = req.app.get('models');
    if (!name) {
      throw new Error('Name is required');
    }
    const schema_name = `tenant_${name.toLowerCase().replace(/\s+/g, '_')}`;
    const tenant = await Tenant.create({ name, email, phone, address, city, country, schema_name });
    return res.status(201).json({ message: 'Tenant created', tenant });
  } catch (err) {
    next(err);
  }
}
  // ─── UPDATE TENANT ───────────────────────────────────────────────────────
  async updateTenant(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { Tenant } = req.app.get('models');
      const tenant = await Tenant.findByPk(id);
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
      await tenant.update(updateData);
      return res.json({ message: 'Updated', tenant });
    } catch (err) {
      next(err);
    }
  }

  // ─── DELETE TENANT ───────────────────────────────────────────────────────
  async deleteTenant(req, res, next) {
    try {
      const { id } = req.params;
      const { Tenant } = req.app.get('models');
      const deleted = await Tenant.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Tenant not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }

  // ─── GET ALL USERS ───────────────────────────────────────────────────────
  async getAllUsers(req, res, next) {
    try {
      const { User } = req.app.get('models');
      const users = await User.findAll();
      return res.json({ users });
    } catch (err) {
      next(err);
    }
  }

  // ─── GET ALL BOOKINGS ────────────────────────────────────────────────────
  async getAllBookings(req, res, next) {
    try {
      const { Tenant } = req.app.get('models');
      const tenants = await Tenant.findAll();
      const all = [];
      for (const t of tenants) {
        const models = initTenantModels(t.schema_name);
        const b = await models.Booking.findAll({ raw: true });
        b.forEach(r => r.tenant_id = t.id);
        all.push(...b);
      }
      return res.json({ bookings: all });
    } catch (err) {
      next(err);
    }
  }
}

export const superAdminController = new SuperAdminController();