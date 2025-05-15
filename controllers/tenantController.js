import { sequelize } from '../config/database.js';

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class TenantController {
  async createTenant(req, res, next) {
    try {
      const { name, email, phone, address, city, country } = req.body;
      const schema_name = `tenant_${name.toLowerCase().replace(/\s+/g, '_')}`;
      const { Tenant } = req.app.get('models');

      // duplicate-email guard
      const existing = await Tenant.findOne({ where: { email } });
      if (existing) {
        return next(
          new HttpError(409, 'A tenant with that e-mail already exists')
        );
      }

      // create tenant row
      const tenant = await Tenant.create({
        name,
        email,
        phone,
        address,
        city,
        country,
        schema_name,
      });

      await sequelize.query(
        'SELECT public.create_tenant_schema(:tenantId);',
        { replacements: { tenantId: tenant.id } }
      );

      return res
        .status(201)
        .json({ message: 'Tenant created successfully', tenant });
    } catch (err) {
      next(err);
    }
  }

  async getTenants(_req, res, next) {
    try {
      const { Tenant } = _req.app.get('models');
      const tenants = await Tenant.findAll();
      return res.status(200).json({ tenants });
    } catch (err) {
      next(err);
    }
  }

  async getTenantById(req, res, next) {
    try {
      const { id } = req.params;
      const { Tenant } = req.app.get('models');

      const tenant = await Tenant.findByPk(id);
      if (!tenant) {
        return next(new HttpError(404, 'Tenant not found'));
      }
      return res.status(200).json({ tenant });
    } catch (err) {
      next(err);
    }
  }

  async deleteTenant(req, res, next) {
    try {
      const { id } = req.params;
      const { Tenant } = req.app.get('models');

      const deleted = await Tenant.destroy({ where: { id } });
      if (!deleted) {
        return next(new HttpError(404, 'Tenant not found'));
      }

      return res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const tenantController = new TenantController();
