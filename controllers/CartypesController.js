import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';


class CarTypeController {
  async createCarType(req, res) {
    const { name, description } = req.body;

    try {
      const { id } = req.params; // Tenant ID
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarType } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const carType = await CarType.create({ name, description });

      res.status(201).json({
        message: 'Car type created successfully',
        carType,
      });
    } catch (error) {
      console.error('Error creating car type:', error);
      res.status(500).json({
        message: 'Internal server error while creating car type',
      });
    }
  }

}

export const carTypeController = new CarTypeController();
