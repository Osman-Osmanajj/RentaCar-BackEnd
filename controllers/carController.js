import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class CarController {
  async createCar(req, res) {
    try {
      const { id } = req.params;
      const { make, model, year, license_plate, status, car_type_id } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Car } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const car = await Car.create({
        make,
        model,
        year,
        license_plate,
        status,
        car_type_id,
      });

      res.status(201).json({ message: 'Car created successfully', car });
    } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({ message: 'Internal server error while creating car' });
    }
  }

  async deleteCars(req, res) {
    try {
      const { id, carId } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Car } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const car = await Car.findByPk(carId);

      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      await car.destroy();

      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      console.error('Error deleting car:', error);
      res.status(500).json({ message: 'Internal server error while deleting car' });
    }
  }

  async getCars(req, res) {
    try {
      const { id } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Car } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const cars = await Car.findAll();

      if (!cars || cars.length === 0) {
        return res.status(404).json({ message: 'No cars found' });
      }

      res.status(200).json(cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ message: 'Internal server error while fetching cars' });
    }
  }

  async getCarById(req, res) {
    try {
      const { id, carId } = req.params;
      
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Car } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Car ID:', carId);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const car = await Car.findByPk(carId);
  
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      res.status(200).json(car);
    } catch (error) {
      console.error('Error fetching car by ID:', error);
      res.status(500).json({ message: 'Internal server error while fetching car' });
    }
  }
  
  async updateCarById(req, res) {
    try {
      const { id, carId } = req.params; 
      const updateData = req.body;
      
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Car } = models;
  
      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Car ID:', carId);
      console.log('Update Data:', updateData);
  
      await sequelize.query(`SET search_path TO ${schemaName};`);
  
      const car = await Car.findByPk(carId);
  
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      await car.update(updateData);
  
      res.status(200).json({ message: 'Car updated successfully', car });
    } catch (error) {
      console.error('Error updating car:', error);
      res.status(500).json({ message: 'Internal server error while updating car' });
    }
  }
  
}

export const carController = new CarController();