import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class CarImageController {
  async createCarImage(req, res) {
    try {
      const { id } = req.params; // tenant ID
      const { car_id, image_url } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarImage } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const carImage = await CarImage.create({ car_id, image_url });

      res.status(201).json({ message: 'Car image created successfully', carImage });
    } catch (error) {
      console.error('Error creating car image:', error);
      res.status(500).json({ message: 'Internal server error while creating car image' });
    }
  }

  async getCarImages(req, res) {
    try {
      const { id } = req.params; // tenant ID

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarImage } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const images = await CarImage.findAll();

      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching car images:', error);
      res.status(500).json({ message: 'Internal server error while fetching car images' });
    }
  }

  async deleteCarImage(req, res) {
    try {
      const { id, imageId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { CarImage } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const image = await CarImage.findByPk(imageId);

      if (!image) {
        return res.status(404).json({ message: 'Car image not found' });
      }

      await image.destroy();

      res.status(200).json({ message: 'Car image deleted successfully' });
    } catch (error) {
      console.error('Error deleting car image:', error);
      res.status(500).json({ message: 'Internal server error while deleting car image' });
    }
  }
}

export const carImageController = new CarImageController();
