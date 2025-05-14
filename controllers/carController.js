class CarController {

  async createCar(req, res, next) {
    try {
      const {
        make,
        model,
        year,
        license_plate,
        status,
        car_type_id,
      } = req.body;

      const { Car } = req.tenantModels;        
      const car = await Car.create({
        make,
        model,
        year,
        license_plate,
        status,
        car_type_id,
      });

      return res.status(201).json({ message: 'Car created successfully', car });
    } catch (err) {
      console.error('Error creating car:', err);
      next(err);
    }
  }

  
  async deleteCar(req, res, next) {
    try {
      const { carId } = req.params;
      const { Car } = req.tenantModels;

      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      await car.destroy();
      return res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
      console.error('Error deleting car:', err);
      next(err);
    }
  }

  
  async getCars(req, res, next) {
    try {
      const { Car } = req.tenantModels;
      const cars = await Car.findAll();

      if (!cars.length) {
        return res.status(404).json({ message: 'No cars found' });
      }

      return res.status(200).json(cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      next(err);
    }
  }
}

export const carController = new CarController();
