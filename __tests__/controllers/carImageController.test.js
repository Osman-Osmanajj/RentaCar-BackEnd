// __tests__/controllers/carImageController.test.js
import { carImageController } from '../../controllers/carImageController.js';

describe('CarImageController', () => {
  let req, res, next, CarImage;

  beforeEach(() => {
    // Stub the model
    CarImage = {
      create:   jest.fn(),
      findAll:  jest.fn(),
      findByPk: jest.fn()
    };

    req = {
      params: {},
      body: {},
      tenantModels: { CarImage }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    // silence any console.error in controller error paths
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCarImage', () => {
    it('responds 201 with created carImage', async () => {
      req.body = { car_id: 1, image_url: 'url.png' };
      const fake = { id: 42, ...req.body };
      CarImage.create.mockResolvedValue(fake);

      await carImageController.createCarImage(req, res, next);

      expect(CarImage.create).toHaveBeenCalledWith({ car_id: 1, image_url: 'url.png' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car image created successfully',
        carImage: fake
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('create failed');
      req.body = { car_id: 2 };
      CarImage.create.mockRejectedValue(boom);

      await carImageController.createCarImage(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getCarImages', () => {
    it('responds 200 with array of images', async () => {
      const arr = [{ id: 1 }, { id: 2 }];
      CarImage.findAll.mockResolvedValue(arr);

      await carImageController.getCarImages(req, res, next);

      expect(CarImage.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('findAll failed');
      CarImage.findAll.mockRejectedValue(boom);

      await carImageController.getCarImages(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteCarImage', () => {
    it('404 if image not found', async () => {
      req.params.id = 5;
      CarImage.findByPk.mockResolvedValue(null);

      await carImageController.deleteCarImage(req, res, next);

      expect(CarImage.findByPk).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car image not found' });
    });

    it('destroys and returns success when found', async () => {
      req.params.id = 6;
      const image = { destroy: jest.fn() };
      CarImage.findByPk.mockResolvedValue(image);

      await carImageController.deleteCarImage(req, res, next);

      expect(image.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car image deleted successfully' });
    });

    it('forwards destroy errors to next()', async () => {
      req.params.id = 7;
      const boom = new Error('destroy fail');
      const image = { destroy: jest.fn().mockRejectedValue(boom) };
      CarImage.findByPk.mockResolvedValue(image);

      await carImageController.deleteCarImage(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('updateCarImage', () => {
    it('404 if image not found', async () => {
      req.params.id = 8;
      req.body = { image_url: 'new.png' };
      CarImage.findByPk.mockResolvedValue(null);

      await carImageController.updateCarImage(req, res, next);

      expect(CarImage.findByPk).toHaveBeenCalledWith(8);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Car image not found' });
    });

    it('updates and returns success when found', async () => {
      req.params.id = 9;
      req.body = { image_url: 'updated.png' };
      const image = { update: jest.fn() };
      CarImage.findByPk.mockResolvedValue(image);

      await carImageController.updateCarImage(req, res, next);

      expect(image.update).toHaveBeenCalledWith({ image_url: 'updated.png' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Car image updated successfully',
        image
      });
    });

    it('forwards update errors to next()', async () => {
      req.params.id = 10;
      req.body = { image_url: 'fail.png' };
      const boom = new Error('update fail');
      const image = { update: jest.fn().mockRejectedValue(boom) };
      CarImage.findByPk.mockResolvedValue(image);

      await carImageController.updateCarImage(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
