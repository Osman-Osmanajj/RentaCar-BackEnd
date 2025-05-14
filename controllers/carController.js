// controllers/carController.js
class CarController {
  /* ───────── POST /api/car/create ───────── */
  async createCar(req, res, next) {
    try {
      const {
        make,
        model,
        year,
        license_plate,
        status = 'Available',
        car_type_id,
      } = req.body;

      const { Car } = req.tenantModels;

      // duplicate license-plate guard (optional)
      const dup = await Car.findOne({ where: { license_plate } });
      if (dup) {
        return res
          .status(409)
          .json({ message: 'A car with that license plate already exists' });
      }

      const car = await Car.create({
        make,
        model,
        year,
        license_plate,
        status,
        car_type_id,
      });

      return res
        .status(201)
        .json({ message: 'Car created successfully', car });
    } catch (err) {
      next(err);
    }
  }

  /* ───────── DELETE /api/car/:id ───────── */
  async deleteCar(req, res, next) {
    try {
      const { id } = req.params;          // id = carId
      const { Car } = req.tenantModels;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      await car.destroy();
      return res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  /* ───────── GET /api/car/all ───────── */
  async getCars(req, res, next) {
    try {
      const { Car } = req.tenantModels;
      const cars = await Car.findAll();

      if (!cars.length) {
        return res.status(404).json({ message: 'No cars found' });
      }
      return res.status(200).json(cars);
    } catch (err) {
      next(err);
    }
  }

  /* ───────── GET /api/car/:id ───────── */
  async getCarById(req, res, next) {
    try {
      const { id } = req.params;          // id = carId
      const { Car } = req.tenantModels;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      return res.status(200).json(car);
    } catch (err) {
      next(err);
    }
  }

  /* ───────── PATCH /api/car/:id ───────── */
  async updateCarById(req, res, next) {
    try {
      const { id } = req.params;          // id = carId
      const updateData = req.body;
      const { Car } = req.tenantModels;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      await car.update(updateData);
      return res
        .status(200)
        .json({ message: 'Car updated successfully', car });
    } catch (err) {
      next(err);
    }
  }
}

export const carController = new CarController();
