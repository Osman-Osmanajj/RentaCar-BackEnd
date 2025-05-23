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
      const { MaintenanceRecord,Car } = req.tenantModels;

      const records = await MaintenanceRecord.findAll({
        include: {
          model: Car,
          attributes: ['make', 'model'],
        },
      });

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

  // Get maintenance record as an "invoice"
async getRecordInvoice(req, res, next) {
  try {
    const { recordId } = req.params;
    const { MaintenanceRecord, Car } = req.tenantModels;

    const record = await MaintenanceRecord.findOne({
      where: { id: recordId },
      include: [{ model: Car, as: 'car' }]
    });

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    // Prepare data for invoice
    const invoiceData = {
      id: record.id,
      car: record.car ? `${record.car.make} ${record.car.model} (${record.car.license_plate})` : 'N/A',
      service_type: record.service_type,
      service_date: record.service_date,
      description: record.description,
      cost: record.cost,
      createdAt: record.createdAt,
    };

    res.status(200).json({ invoice: invoiceData });
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
