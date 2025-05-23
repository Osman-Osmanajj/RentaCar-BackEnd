// __tests__/controllers/cartypesController.test.js
import { carTypeController } from '../../controllers/CartypesController.js';

describe('CarTypeController', () => {
  let req, res, next, CarType;

  beforeEach(() => {
    CarType = {
      create:   jest.fn(),
      findByPk: jest.fn(),
      findAll:  jest.fn()
    };
    req = {
      params: {},
      body: {},
      tenantModels: { CarType }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCarType', () => {
    it('creates a new car type', async () => {
      req.body = { name: 'SUV', description: 'Sport Utility Vehicle' };
      const fake = { id: 1, ...req.body };
      CarType.create.mockResolvedValue(fake);

      await carTypeController.createCarType(req, res, next);

      expect(CarType.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car type created successfully',
        carType: fake
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('DB fail');
      CarType.create.mockRejectedValue(boom);
      req.body = { name: 'Sedan' };

      await carTypeController.createCarType(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteCarTypeById', () => {
    it('404 if not found', async () => {
      req.params.id = 5;
      CarType.findByPk.mockResolvedValue(null);

      await carTypeController.deleteCarTypeById(req, res, next);

      expect(CarType.findByPk).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car type not found' });
    });

    it('deletes and returns success', async () => {
      req.params.id = 6;
      const ct = { destroy: jest.fn() };
      CarType.findByPk.mockResolvedValue(ct);

      await carTypeController.deleteCarTypeById(req, res, next);

      expect(ct.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car type deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      req.params.id = 7;
      const boom = new Error('destroy fail');
      const ct = { destroy: jest.fn().mockRejectedValue(boom) };
      CarType.findByPk.mockResolvedValue(ct);

      await carTypeController.deleteCarTypeById(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getCarTypes', () => {
    it('404 when none exist', async () => {
      CarType.findAll.mockResolvedValue([]);

      await carTypeController.getCarTypes(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No car types found' });
    });

    it('200 with list when present', async () => {
      const list = [{ id: 1 }, { id: 2 }];
      CarType.findAll.mockResolvedValue(list);

      await carTypeController.getCarTypes(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(list);
    });

    it('forwards findAll errors', async () => {
      const boom = new Error('findAll failed');
      CarType.findAll.mockRejectedValue(boom);

      await carTypeController.getCarTypes(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getCarTypeById', () => {
    it('404 if not found', async () => {
      req.params.id = 8;
      CarType.findByPk.mockResolvedValue(null);

      await carTypeController.getCarTypeById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car type not found' });
    });

    it('200 with object if found', async () => {
      req.params.id = 9;
      const fake = { id: 9, name: 'Coupe' };
      CarType.findByPk.mockResolvedValue(fake);

      await carTypeController.getCarTypeById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('forwards findByPk errors', async () => {
      const boom = new Error('findByPk fail');
      req.params.id = 10;
      CarType.findByPk.mockRejectedValue(boom);

      await carTypeController.getCarTypeById(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('updateCarTypeById', () => {
    it('404 if not found', async () => {
      req.params.id = 11;
      req.body = { description: 'Updated' };
      CarType.findByPk.mockResolvedValue(null);

      await carTypeController.updateCarTypeById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car type not found' });
    });

    it('updates and returns success', async () => {
      req.params.id = 12;
      const updateData = { description: 'New desc' };
      req.body = updateData;
      const ct = { update: jest.fn() };
      CarType.findByPk.mockResolvedValue(ct);

      await carTypeController.updateCarTypeById(req, res, next);

      expect(ct.update).toHaveBeenCalledWith(updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car type updated successfully',
        carType: ct
      });
    });

    it('forwards update errors', async () => {
      const boom = new Error('update fail');
      req.params.id = 13;
      req.body = { name: 'Test' };
      const ct = { update: jest.fn().mockRejectedValue(boom) };
      CarType.findByPk.mockResolvedValue(ct);

      await carTypeController.updateCarTypeById(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
