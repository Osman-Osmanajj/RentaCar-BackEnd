import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class LocationController {
  async createLocation(req, res) {
    try {
      const { id } = req.params;
      const { address, city, country, phone_number } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Location } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const location = await Location.create({ address, city, country, phone_number });

      res.status(201).json({ message: 'Location created successfully', location });
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ message: 'Internal server error while creating location' });
    }
  }

  async deleteLocation(req, res) {
    try {
      const { id, locationId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Location } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const location = await Location.findByPk(locationId);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      await location.destroy();

      res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ message: 'Internal server error while deleting location' });
    }
  }

  async getLocations(req, res) {
    try {
      const { id } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Location } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const locations = await Location.findAll();

      if (!locations || locations.length === 0) {
        return res.status(404).json({ message: 'No locations found' });
      }

      res.status(200).json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Internal server error while fetching locations' });
    }
  }

  async getLocationById(req, res) {
    try {
      const { id, locationId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Location } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Location ID:', locationId);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const location = await Location.findByPk(locationId);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      res.status(200).json(location);
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      res.status(500).json({ message: 'Internal server error while fetching location' });
    }
  }

  async updateLocationById(req, res) {
    try {
      const { id, locationId } = req.params;
      const updateData = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Location } = models;

      console.log('Tenant ID:', id);
      console.log('Schema Name:', schemaName);
      console.log('Location ID:', locationId);
      console.log('Update Data:', updateData);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const location = await Location.findByPk(locationId);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      await location.update(updateData);

      res.status(200).json({ message: 'Location updated successfully', location });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ message: 'Internal server error while updating location' });
    }
  }
}

export const locationController = new LocationController();
