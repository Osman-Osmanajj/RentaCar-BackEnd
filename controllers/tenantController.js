import { sequelize } from '../config/database.js';

class TenantController {
  async createTenant(req, res, next) {
    try {
      const { name, email, phone, address, city, country } = req.body;
      const schema_name = `tenant_${name.toLowerCase().replace(/\s+/g, '_')}`;
      const { Tenant } = req.app.get('models');

      //prevent duplicate e-mail
      const existing = await Tenant.findOne({ where: { email } });
      if (existing) {
        return res
          .status(409)
          .json({ message: 'A tenant with that e-mail already exists' });
      }

      // create tenant
      const tenant = await Tenant.create({
        name,
        email,
        phone,
        address,
        city,
        country,
        schema_name,
      });

      //create schema via trigger helper
      await sequelize.query(
        'SELECT public.create_tenant_schema(:tenantId);',
        { replacements: { tenantId: tenant.id } }
      );

      return res
        .status(201)
        .json({ message: 'Tenant created successfully', tenant });
    } catch (err) {
      console.error('⚠️  PG-error →', err.parent?.message);
      console.error(err.parent?.detail);
      next(err);
    }
  }
}

export const tenantController = new TenantController();
