import { sequelize } from '../config/database.js';
import { PublicModelService } from '../services/PublicModelService.js';
import{TenantModelService} from '../services/TenantModelService.js';


class MaintenanceController {
  async createRecord(req, res) {
    try {
      const { car_id, service_type, service_date, description, cost } = req.body;
      const { id } = req.params; 
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService)
      const { models,schemaName } = await tenantModelService.getTenantModels(id);
      const { MaintenanceRecord } = models;
      await sequelize.query(`SET search_path TO ${schemaName};`);
      const record = await MaintenanceRecord.create({
        car_id,
        service_type,
        service_date,
        description,
        cost,
      });

      res.status(201).json({ message: 'Maintenance record created successfully', record });
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      res.status(500).json({ message: 'Internal server error while creating maintenance record' });
    }
  }

  async getAllRecords(req, res) {
    try {
      const { id } = req.params; 
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService)
      const { models,schemaName } = await tenantModelService.getTenantModels(id);
      const { MaintenanceRecord } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const records = await MaintenanceRecord.findAll();

      res.status(200).json({ records });
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      res.status(500).json({ message: 'Internal server error while fetching maintenance records' });
    }
  }

  async getRecordById(req, res) {
    try {
      const { id, recordId } = req.params; 
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService)
      const { models,schemaName } = await tenantModelService.getTenantModels(id);
      const { MaintenanceRecord } = models;

      
      await sequelize.query(`SET search_path TO ${schemaName};`);
      const record = await MaintenanceRecord.findOne({ where: { id: recordId } });

      if (!record) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }

      res.status(200).json({ record });
    } catch (error) {
      console.error('Error fetching maintenance record:', error);
      res.status(500).json({ message: 'Internal server error while fetching maintenance record' });
    }
  }

  async deleteRecord(req, res) {
    try {
      const { id, recordId } = req.params;
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService)
      const { models,schemaName } = await tenantModelService.getTenantModels(id);
      const { MaintenanceRecord } = models;

      
      await sequelize.query(`SET search_path TO ${schemaName};`);

      const deleted = await MaintenanceRecord.destroy({ where: { id: recordId } });

      if (!deleted) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }

      res.status(200).json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      res.status(500).json({ message: 'Internal server error while deleting maintenance record' });
    }
  }
}

export const maintenanceController = new MaintenanceController();
