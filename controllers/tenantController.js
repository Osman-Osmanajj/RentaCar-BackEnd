import { sequelize } from '../config/database.js';
import { PublicModelService } from '../services/PublicModelService.js';

class TenantController {
  async createTenant(req, res) {
    try {
      const { name, email, phone, address, city, country } = req.body;

      const schema_name = `tenant_${name.toLowerCase().replace(/\s+/g, '_')}`;

      const publicModelService = new PublicModelService(sequelize);
      const models = publicModelService.getModels();

      const { Tenant } = models;
      
      console.log('tenant:', typeof Tenant);

      const tenant = await Tenant.create({
        name,
        email,
        phone,
        address,
        city,
        country,
        schema_name,
      });

      try {
        await sequelize.query('SELECT public.create_tenant_schema(:tenantId);', {
          replacements: { tenantId: tenant.id },
        });

        res.status(201).json({ message: 'Tenant created successfully', tenant });
      } catch (error) {
        console.error('Error creating schema:', error);
        return res.status(500).json({ message: 'Internal server error while creating schema' });
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      return res.status(500).json({ message: 'Internal server error while creating tenant' });
    }
  }

}

export const tenantController = new TenantController();
