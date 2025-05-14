import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class LocationInventoryController {
  async createInventory(req, res) {
    try {
      const { id } = req.params; 
      const { location_id, car_id, quantity_available } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { LocationInventory } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const inventory = await LocationInventory.create({
        location_id,
        car_id,
        quantity_available,
      });

      res.status(201).json({ message: 'Inventory record created successfully', inventory });
    } catch (error) {
      console.error('Error creating inventory:', error);
      res.status(500).json({ message: 'Internal server error while creating inventory' });
    }
  }

  async getInventories(req, res) {
    try {
      const { id } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { LocationInventory } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const inventories = await LocationInventory.findAll();

      if (!inventories || inventories.length === 0) {
        return res.status(404).json({ message: 'No inventory records found' });
      }

      res.status(200).json(inventories);
    } catch (error) {
      console.error('Error fetching inventories:', error);
      res.status(500).json({ message: 'Internal server error while fetching inventories' });
    }
  }
}

export const locationInventoryController = new LocationInventoryController();
