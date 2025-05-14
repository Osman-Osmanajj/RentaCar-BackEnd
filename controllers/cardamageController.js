import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class CarDamageReportController {
  async createDamageReport(req, res) {
    try {
      const { id } = req.params;
      const { car_id, damage_type, description, cost, status } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarDamageReport } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const report = await CarDamageReport.create({
        car_id,
        damage_type,
        description,
        cost,
        status,
      });

      res.status(201).json({ message: 'Damage report created successfully', report });
    } catch (error) {
      console.error('Error creating damage report:', error);
      res.status(500).json({ message: 'Internal server error while creating damage report' });
    }
  }

  async getDamageReports(req, res) {
    try {
      const { id } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarDamageReport } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const reports = await CarDamageReport.findAll();

      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: 'No damage reports found' });
      }

      res.status(200).json(reports);
    } catch (error) {
      console.error('Error fetching damage reports:', error);
      res.status(500).json({ message: 'Internal server error while fetching damage reports' });
    }
  }

  async getDamageReportById(req, res) {
    try {
      const { id, reportId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarDamageReport } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const report = await CarDamageReport.findByPk(reportId);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      res.status(200).json(report);
    } catch (error) {
      console.error('Error fetching damage report by ID:', error);
      res.status(500).json({ message: 'Internal server error while fetching damage report' });
    }
  }

  async updateDamageReport(req, res) {
    try {
      const { id, reportId } = req.params;
      const updateData = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarDamageReport } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const report = await CarDamageReport.findByPk(reportId);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      await report.update(updateData);

      res.status(200).json({ message: 'Damage report updated successfully', report });
    } catch (error) {
      console.error('Error updating damage report:', error);
      res.status(500).json({ message: 'Internal server error while updating damage report' });
    }
  }

  async deleteDamageReport(req, res) {
    try {
      const { id, reportId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarDamageReport } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const report = await CarDamageReport.findByPk(reportId);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      await report.destroy();

      res.status(200).json({ message: 'Damage report deleted successfully' });
    } catch (error) {
      console.error('Error deleting damage report:', error);
      res.status(500).json({ message: 'Internal server error while deleting damage report' });
    }
  }
}

export const carDamageReportController = new CarDamageReportController();
