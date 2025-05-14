import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';


class CarTypeController {
  async createCarType(req, res) {
    const { name, description } = req.body;

    try {
      const { id } = req.params;
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

  async deleteCarTypeById(req, res) {
    try {
      const { id, carTypeId } = req.params;
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarType } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Car Type ID:', carTypeId);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const carType = await CarType.findByPk(carTypeId);
  
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }
  
      await carType.destroy();
  
      res.status(200).json({ message: 'Car type deleted successfully' });
    } catch (error) {
      console.error('Error deleting car type:', error);
      res.status(500).json({ message: 'Internal server error while deleting car type' });
    }
  }
  
  async getCarTypes(req, res) {
    try {
      const { id } = req.params;
  
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarType } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const carTypes = await CarType.findAll();
  
      if (!carTypes || carTypes.length === 0) {
        return res.status(404).json({ message: 'No car types found' });
      }
  
      res.status(200).json(carTypes);
    } catch (error) {
      console.error('Error fetching car types:', error);
      res.status(500).json({ message: 'Internal server error while fetching car types' });
    }
  }
  
  async getCarTypeById(req, res) {
    try {
      const { id, carTypeId } = req.params;
  
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarType } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Car Type ID:', carTypeId);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const carType = await CarType.findByPk(carTypeId);
  
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }
  
      res.status(200).json(carType);
    } catch (error) {
      console.error('Error fetching car type by ID:', error);
      res.status(500).json({ message: 'Internal server error while fetching car type' });
    }
  }
  
  async updateCarTypeById(req, res) {
    try {
      const { id, carTypeId } = req.params;
      const updateData = req.body;
  
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarType } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('CarType ID:', carTypeId);
      console.log('Update Data:', updateData);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const carType = await CarType.findByPk(carTypeId);
  
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }
  
      await carType.update(updateData);
  
      res.status(200).json({ message: 'Car type updated successfully', carType });
    } catch (error) {
      console.error('Error updating car type:', error);
      res.status(500).json({ message: 'Internal server error while updating car type' });
    }
  }
  
}

export const carTypeController = new CarTypeController();
