class CarTypeController {

  async createCarType(req, res, next) {
    try {
      const { name, description } = req.body;
      const { CarType } = req.tenantModels;

      const carType = await CarType.create({ name, description });

      return res.status(201).json({
        message: 'Car type created successfully',
        carType,
      });
    } catch (err) {
      console.error('Error creating car type:', err);
      next(err);
    }
  }
}

export const carTypeController = new CarTypeController();
