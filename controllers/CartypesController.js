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
      next(err);
    }
  }

  async deleteCarTypeById(req, res, next) {
    try {
      const { id } = req.params;           
      const { CarType } = req.tenantModels;

      const carType = await CarType.findByPk(id);
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }

      await carType.destroy();
      res.status(200).json({ message: 'Car type deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getCarTypes(req, res, next) {
    try {
      const { CarType } = req.tenantModels;
      const carTypes = await CarType.findAll();

      if (!carTypes.length) {
        return res.status(404).json({ message: 'No car types found' });
      }
      res.status(200).json(carTypes);
    } catch (err) {
      next(err);
    }
  }

  async getCarTypeById(req, res, next) {
    try {
      const { id } = req.params;            
      const { CarType } = req.tenantModels;

      const carType = await CarType.findByPk(id);
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }
      res.status(200).json(carType);
    } catch (err) {
      next(err);
    }
  }

  async updateCarTypeById(req, res, next) {
    try {
      const { id } = req.params;            
      const updateData = req.body;
      const { CarType } = req.tenantModels;

      const carType = await CarType.findByPk(id);
      if (!carType) {
        return res.status(404).json({ message: 'Car type not found' });
      }

      await carType.update(updateData);
      res.status(200).json({
        message: 'Car type updated successfully',
        carType,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const carTypeController = new CarTypeController();
