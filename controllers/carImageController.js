class CarImageController {
  /* ───────── POST /api/car-image/create ───────── */
  async createCarImage(req, res, next) {
    try {
      const { car_id, image_url } = req.body;
      const { CarImage } = req.tenantModels;

      const carImage = await CarImage.create({ car_id, image_url });

      res.status(201).json({ message: 'Car image created successfully', carImage });
    } catch (error) {
      next(error);
    }
  }

  /* ───────── GET /api/car-image/all ───────── */
  async getCarImages(req, res, next) {
    try {
      const { CarImage } = req.tenantModels;

      const images = await CarImage.findAll();

      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  }

  /* ───────── DELETE /api/car-image/:id ───────── */
  async deleteCarImage(req, res, next) {
    try {
      const { id } = req.params; // id = imageId
      const { CarImage } = req.tenantModels;

      const image = await CarImage.findByPk(id);

      if (!image) {
        return res.status(404).json({ message: 'Car image not found' });
      }

      await image.destroy();

      res.status(200).json({ message: 'Car image deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const carImageController = new CarImageController();
