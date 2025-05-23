// __tests__/controllers/carDamageReportController.test.js
import { carDamageReportController } from '../../controllers/cardamageController.js';

describe('CarDamageReportController', () => {
  let req, res, next, CarDamageReport;

  beforeEach(() => {
    // stub the model methods
    CarDamageReport = {
      create:   jest.fn(),
      findAll:  jest.fn(),
      findByPk: jest.fn()
    };

    req = {
      params: {},
      body: {},
      tenantModels: { CarDamageReport }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    // silence errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDamageReport', () => {
    it('responds 201 with created report', async () => {
      req.body = {
        car_id: 1,
        damage_type: 'Scratch',
        description: 'Minor scratch on door',
        cost: 200,
        status: 'Open'
      };
      const fake = { id: 99, ...req.body };
      CarDamageReport.create.mockResolvedValue(fake);

      await carDamageReportController.createDamageReport(req, res, next);

      expect(CarDamageReport.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Damage report created successfully',
        report: fake
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('DB error');
      CarDamageReport.create.mockRejectedValue(boom);
      req.body = { car_id: 2 };

      await carDamageReportController.createDamageReport(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getDamageReports', () => {
    it('404 when no reports', async () => {
      CarDamageReport.findAll.mockResolvedValue([]);

      await carDamageReportController.getDamageReports(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No damage reports found' });
    });

    it('200 with array of reports', async () => {
      const arr = [{ id: 1 }, { id: 2 }];
      CarDamageReport.findAll.mockResolvedValue(arr);

      await carDamageReportController.getDamageReports(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });
  });

  describe('getDamageReportById', () => {
    it('404 if not found', async () => {
      req.params.id = 5;
      CarDamageReport.findByPk.mockResolvedValue(null);

      await carDamageReportController.getDamageReportById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Damage report not found' });
    });

    it('200 with report when found', async () => {
      req.params.id = 6;
      const fake = { id: 6, cost: 300 };
      CarDamageReport.findByPk.mockResolvedValue(fake);

      await carDamageReportController.getDamageReportById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });
  });

  describe('updateDamageReport', () => {
    it('404 if not found', async () => {
      req.params.id = 7;
      req.body = { status: 'Closed' };
      CarDamageReport.findByPk.mockResolvedValue(null);

      await carDamageReportController.updateDamageReport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Damage report not found' });
    });

    it('200 with updated report', async () => {
      req.params.id = 8;
      req.body = { status: 'Closed', cost: 250 };
      const report = { update: jest.fn() };
      CarDamageReport.findByPk.mockResolvedValue(report);

      await carDamageReportController.updateDamageReport(req, res, next);

      expect(report.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Damage report updated successfully',
        report
      });
    });

    it('forwards update errors', async () => {
      const boom = new Error('update fail');
      req.params.id = 9;
      req.body = { status: 'Error' };
      const report = { update: jest.fn().mockRejectedValue(boom) };
      CarDamageReport.findByPk.mockResolvedValue(report);

      await carDamageReportController.updateDamageReport(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteDamageReport', () => {
    it('404 if not found', async () => {
      req.params.id = 10;
      CarDamageReport.findByPk.mockResolvedValue(null);

      await carDamageReportController.deleteDamageReport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Damage report not found' });
    });

    it('200 when deleted successfully', async () => {
      req.params.id = 11;
      const report = { destroy: jest.fn() };
      CarDamageReport.findByPk.mockResolvedValue(report);

      await carDamageReportController.deleteDamageReport(req, res, next);

      expect(report.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Damage report deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      const boom = new Error('destroy fail');
      req.params.id = 12;
      const report = { destroy: jest.fn().mockRejectedValue(boom) };
      CarDamageReport.findByPk.mockResolvedValue(report);

      await carDamageReportController.deleteDamageReport(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
