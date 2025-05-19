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
        price,
        image_url,
      } = req.body;

      const { Car , CarImage} = req.tenantModels;

      // duplicate license-plate guard (optional)
      const dup = await Car.findOne({ where: { license_plate } });
      if (dup) {
        return res
          .status(409)
          .json({ message: 'A car with that license plate already exists' });
      }
      ;
      
      

      const car = await Car.create({
        make,
        model,
        year,
        license_plate,
        status,
        car_type_id,
        price,
      });
      
      const carImage = await CarImage.create({
        car_id: car.id,
        image_url,
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
    const { id } = req.params;
    const { Car, CarImage } = req.tenantModels;

    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const carImage = await CarImage.findOne({ where: { car_id: id } });
    if (carImage) {
      await carImage.destroy();
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
      const { Car,CarImage,CarType } = req.tenantModels;
      const cars = await Car.findAll({
        include: [
          {
            model: CarImage,
            attributes: ['image_url'],
          },
          {
            model: CarType,
            attributes: ['name'],
          }
        ]

      });

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
      const { Car, CarImage } = req.tenantModels;

      const car = await Car.findByPk(id ,{
      include: [
        {
          model: CarImage,
          attributes: ['image_url'],
        },
      ],
    });
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
      const { id } = req.params;          
      const updateData = req.body;
      const { Car,CarImage } = req.tenantModels;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      const { image_url } = updateData;
      if (image_url) {
        const carImage = await CarImage.findOne({ where: { car_id: id } });
        if (!carImage) {
          return res.status(404).json({ message: 'Car image not found' });
        }
        await carImage.update({ image_url });
      }
      await car.update(updateData);
      return res
        .status(200)
        .json({ message: 'Car updated successfully', car });
    } catch (err) {
      next(err);
    }
  }
   /* ───────── GET /api/car/img-type ───────── */
  async getCarsTypesImages(req, res, next) {
    try {
      const { Car, CarImage, CarType } = req.tenantModels;

      const cars = await Car.findAll({
        include: [
          {
            model: CarImage,
          },
          {
            model: CarType,
            required: false 
          }
        ]
      });

      if (!cars.length) {
        return res.status(404).json({ message: 'No cars found' });
      }

      return res.status(200).json(cars);
    } catch (err) {
      next(err);
    }
  }

}

export const carController = new CarController();
