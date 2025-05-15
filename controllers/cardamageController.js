class CarDamageReportController {
  // create a damage report
  async createDamageReport(req, res, next) {
    try {
      const { car_id, damage_type, description, cost, status } = req.body;
      const { CarDamageReport } = req.tenantModels;

      const report = await CarDamageReport.create({
        car_id,
        damage_type,
        description,
        cost,
        status,
      });

      res.status(201).json({ message: 'Damage report created successfully', report });
    } catch (error) {
      next(error);
    }
  }

// get all damage reports
  async getDamageReports(req, res, next) {
    try {
      const { CarDamageReport } = req.tenantModels;

      const reports = await CarDamageReport.findAll();

      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: 'No damage reports found' });
      }

      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  // get demage reprt by id
  async getDamageReportById(req, res, next) {
    try {
      const { id } = req.params; // id = reportId
      const { CarDamageReport } = req.tenantModels;

      const report = await CarDamageReport.findByPk(id);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  // update damage report
  async updateDamageReport(req, res, next) {
    try {
      const { id } = req.params; // id = reportId
      const updateData = req.body;
      const { CarDamageReport } = req.tenantModels;

      const report = await CarDamageReport.findByPk(id);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      await report.update(updateData);

      res.status(200).json({ message: 'Damage report updated successfully', report });
    } catch (error) {
      next(error);
    }
  }

  // delete damage report
  async deleteDamageReport(req, res, next) {
    try {
      const { id } = req.params; // id = reportId
      const { CarDamageReport } = req.tenantModels;

      const report = await CarDamageReport.findByPk(id);

      if (!report) {
        return res.status(404).json({ message: 'Damage report not found' });
      }

      await report.destroy();

      res.status(200).json({ message: 'Damage report deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const carDamageReportController = new CarDamageReportController();
