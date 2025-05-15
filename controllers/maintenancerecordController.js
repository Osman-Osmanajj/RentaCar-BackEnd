class MaintenanceController {
  async createRecord(req, res, next) {
    try {
      const { car_id, service_type, service_date, description, cost } = req.body;
      const { MaintenanceRecord } = req.tenantModels;

      const record = await MaintenanceRecord.create({
        car_id,
        service_type,
        service_date,
        description,
        cost,
      });

      res.status(201).json({ message: 'Maintenance record created successfully', record });
    } catch (error) {
      next(error);
    }
  }

  async getAllRecords(req, res, next) {
    try {
      const { MaintenanceRecord } = req.tenantModels;

      const records = await MaintenanceRecord.findAll();

      res.status(200).json({ records });
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const { recordId } = req.params;
      const { MaintenanceRecord } = req.tenantModels;

      const record = await MaintenanceRecord.findOne({ where: { id: recordId } });

      if (!record) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }

      res.status(200).json({ record });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(req, res, next) {
    try {
      const { recordId } = req.params;
      const { MaintenanceRecord } = req.tenantModels;

      const deleted = await MaintenanceRecord.destroy({ where: { id: recordId } });

      if (!deleted) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }

      res.status(200).json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const maintenanceController = new MaintenanceController();
