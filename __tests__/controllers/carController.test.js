// __tests__/controllers/carController.test.js
import { carController } from '../../controllers/carController.js';

describe('CarController', () => {
  let req, res, next;
  let Car, CarImage, CarType;

  beforeEach(() => {
    Car      = { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn(), findAll: jest.fn(), associations: {}, belongsTo: jest.fn(), destroy: jest.fn() };
    CarImage = { create: jest.fn(), findOne: jest.fn() };
    CarType  = {};

    req = {
      params: {},
      body: {},
      tenantModels: { Car, CarImage, CarType }
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

  describe('createCar', () => {
    it('409 if duplicate license_plate', async () => {
      req.body = { license_plate: 'ABC123' };
      Car.findOne.mockResolvedValue({ id: 1 });

      await carController.createCar(req, res, next);

      expect(Car.findOne).toHaveBeenCalledWith({ where: { license_plate: 'ABC123' } });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'A car with that license plate already exists' });
    });

    it('creates car and image on success', async () => {
      req.body = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        license_plate: 'XYZ789',
        status: 'Available',
        car_type_id: 2,
        price: 150,
        image_url: 'http://img'
      };
      Car.findOne.mockResolvedValue(null);
      const fakeCar = { id: 5, ...req.body };
      Car.create.mockResolvedValue(fakeCar);
      CarImage.create.mockResolvedValue({ id: 10, car_id: 5, image_url: 'http://img' });

      await carController.createCar(req, res, next);

      expect(Car.create).toHaveBeenCalledWith({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        license_plate: 'XYZ789',
        status: 'Available',
        car_type_id: 2,
        price: 150
      });
      expect(CarImage.create).toHaveBeenCalledWith({ car_id: 5, image_url: 'http://img' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car created successfully',
        car: fakeCar
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('no DB');
      Car.findOne.mockResolvedValue(null);
      Car.create.mockRejectedValue(boom);
      req.body = { license_plate: 'FAIL' };

      await carController.createCar(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteCar', () => {
    it('404 if not found', async () => {
      req.params.id = 7;
      Car.findByPk.mockResolvedValue(null);

      await carController.deleteCar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car not found' });
    });

    it('destroys image & car when image exists', async () => {
      req.params.id = 7;
      const car = { destroy: jest.fn() };
      const img = { destroy: jest.fn() };
      Car.findByPk.mockResolvedValue(car);
      CarImage.findOne.mockResolvedValue(img);

      await carController.deleteCar(req, res, next);

      expect(CarImage.findOne).toHaveBeenCalledWith({ where: { car_id: 7 } });
      expect(img.destroy).toHaveBeenCalled();
      expect(car.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car deleted successfully' });
    });

    it('destroys car when no image', async () => {
      req.params.id = 8;
      const car = { destroy: jest.fn() };
      Car.findByPk.mockResolvedValue(car);
      CarImage.findOne.mockResolvedValue(null);

      await carController.deleteCar(req, res, next);

      expect(car.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car deleted successfully' });
    });
  });

  describe('getCars', () => {
    it('404 when no cars', async () => {
      Car.findAll.mockResolvedValue([]);

      await carController.getCars(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No cars found' });
    });

    it('returns array of cars', async () => {
      const arr = [{ id: 1 }, { id: 2 }];
      Car.findAll.mockResolvedValue(arr);

      await carController.getCars(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });
  });

  describe('getCarById', () => {
    it('404 if not found', async () => {
      req.params.id = 3;
      Car.findByPk.mockResolvedValue(null);

      await carController.getCarById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car not found' });
    });

    it('returns car when found', async () => {
      req.params.id = 4;
      const car = { id: 4 };
      Car.findByPk.mockResolvedValue(car);

      await carController.getCarById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(car);
    });
  });

  describe('updateCarById', () => {
    it('404 if not found', async () => {
      req.params.id = 9;
      req.body = { model: 'X' };
      Car.findByPk.mockResolvedValue(null);

      await carController.updateCarById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car not found' });
    });

    it('404 if updating image but none exists', async () => {
      req.params.id = 9;
      req.body = { image_url: 'new.png' };
      const car = { update: jest.fn() };
      Car.findByPk.mockResolvedValue(car);
      CarImage.findOne.mockResolvedValue(null);

      await carController.updateCarById(req, res, next);

      expect(CarImage.findOne).toHaveBeenCalledWith({ where: { car_id: 9 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car image not found' });
    });

    it('updates image and car when image exists', async () => {
      req.params.id = 10;
      req.body = { image_url: 'new.png', price: 200 };
      const car = { update: jest.fn() };
      const img = { update: jest.fn() };
      Car.findByPk.mockResolvedValue(car);
      CarImage.findOne.mockResolvedValue(img);

      await carController.updateCarById(req, res, next);

      expect(img.update).toHaveBeenCalledWith({ image_url: 'new.png' });
      expect(car.update).toHaveBeenCalledWith({ image_url: 'new.png', price: 200 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car updated successfully',
        car
      });
    });

    it('updates only car when no image_url in body', async () => {
      req.params.id = 11;
      req.body = { price: 300 };
      const car = { update: jest.fn() };
      Car.findByPk.mockResolvedValue(car);

      await carController.updateCarById(req, res, next);

      expect(car.update).toHaveBeenCalledWith({ price: 300 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car updated successfully',
        car
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('fail update');
      req.params.id = 12;
      req.body = { price: 123 };
      Car.findByPk.mockRejectedValue(boom);

      await carController.updateCarById(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getCarsTypesImages', () => {
    it('404 when no cars', async () => {
      Car.findAll.mockResolvedValue([]);

      await carController.getCarsTypesImages(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No cars found' });
    });

    it('returns cars with types/images', async () => {
      const arr = [{ id: 1 }];
      Car.findAll.mockResolvedValue(arr);

      await carController.getCarsTypesImages(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });
  });
});
