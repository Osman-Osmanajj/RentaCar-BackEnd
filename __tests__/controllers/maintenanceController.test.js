// __tests__/controllers/maintenanceController.test.js
import { maintenanceController } from '../../controllers/maintenancerecordController.js';

describe('MaintenanceController', () => {
  let req, res, next;
  let MaintenanceRecord, Car;

  beforeEach(() => {
    MaintenanceRecord = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn()
    };
    Car = {};

    req = {
      params: {},
      body: {},
      tenantModels: { MaintenanceRecord, Car }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // silence console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecord', () => {
    it('creates a maintenance record', async () => {
      req.body = {
        car_id: 1,
        service_type: 'Oil Change',
        service_date: '2025-06-01',
        description: 'Changed oil',
        cost: 75
      };
      const fake = { id: 10, ...req.body };
      MaintenanceRecord.create.mockResolvedValue(fake);

      await maintenanceController.createRecord(req, res, next);

      expect(MaintenanceRecord.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Maintenance record created successfully',
        record: fake
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('create failed');
      MaintenanceRecord.create.mockRejectedValue(boom);

      await maintenanceController.createRecord(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getAllRecords', () => {
    it('returns all records with included Car', async () => {
      const fake = [{ id: 1 }, { id: 2 }];
      MaintenanceRecord.findAll.mockResolvedValue(fake);

      await maintenanceController.getAllRecords(req, res, next);

      expect(MaintenanceRecord.findAll).toHaveBeenCalledWith({
        include: {
          model: Car,
          attributes: ['make', 'model']
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ records: fake });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('findAll failed');
      MaintenanceRecord.findAll.mockRejectedValue(boom);

      await maintenanceController.getAllRecords(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getRecordById', () => {
    it('404 if record not found', async () => {
      req.params.recordId = 5;
      MaintenanceRecord.findOne.mockResolvedValue(null);

      await maintenanceController.getRecordById(req, res, next);

      expect(MaintenanceRecord.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record not found' });
    });

    it('200 with record when found', async () => {
      req.params.recordId = 6;
      const fake = { id: 6, cost: 100 };
      MaintenanceRecord.findOne.mockResolvedValue(fake);

      await maintenanceController.getRecordById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ record: fake });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('findOne failed');
      MaintenanceRecord.findOne.mockRejectedValue(boom);

      await maintenanceController.getRecordById(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getRecordInvoice', () => {
    it('404 if record not found', async () => {
      req.params.recordId = 7;
      MaintenanceRecord.findOne.mockResolvedValue(null);

      await maintenanceController.getRecordInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record not found' });
    });

    it('200 with formatted invoice data', async () => {
      req.params.recordId = 8;
      const record = {
        id: 8,
        service_type: 'Tune-up',
        service_date: '2025-06-05',
        description: 'Full tune-up',
        cost: 150,
        createdAt: '2025-06-05T10:00:00Z',
        car: { make: 'Ford', model: 'Fiesta', license_plate: 'XYZ' }
      };
      MaintenanceRecord.findOne.mockResolvedValue(record);

      await maintenanceController.getRecordInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        invoice: {
          id: 8,
          car: 'Ford Fiesta (XYZ)',
          service_type: 'Tune-up',
          service_date: '2025-06-05',
          description: 'Full tune-up',
          cost: 150,
          createdAt: '2025-06-05T10:00:00Z'
        }
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('invoice fail');
      MaintenanceRecord.findOne.mockRejectedValue(boom);

      await maintenanceController.getRecordInvoice(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteRecord', () => {
    it('404 if nothing deleted', async () => {
      req.params.recordId = 9;
      MaintenanceRecord.destroy.mockResolvedValue(0);

      await maintenanceController.deleteRecord(req, res, next);

      expect(MaintenanceRecord.destroy).toHaveBeenCalledWith({ where: { id: 9 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record not found' });
    });

    it('200 when deleted', async () => {
      req.params.recordId = 10;
      MaintenanceRecord.destroy.mockResolvedValue(1);

      await maintenanceController.deleteRecord(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance record deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      const boom = new Error('destroy fail');
      MaintenanceRecord.destroy.mockRejectedValue(boom);

      await maintenanceController.deleteRecord(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
