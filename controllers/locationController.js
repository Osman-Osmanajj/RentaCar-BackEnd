class LocationController {
  /* ───────── POST /api/location/create ───────── */
  async createLocation(req, res, next) {
    try {
      const { address, city, country, phone_number } = req.body;
      const { Location } = req.tenantModels;

      const location = await Location.create({ address, city, country, phone_number });

      res.status(201).json({ message: 'Location created successfully', location });
    } catch (error) {
      next(error);
    }
  }

  /* ───────── DELETE /api/location/:id ───────── */
  async deleteLocation(req, res, next) {
    try {
      const { id } = req.params; // id = locationId
      const { Location } = req.tenantModels;

      const location = await Location.findByPk(id);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      await location.destroy();

      res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /* ───────── GET /api/location/all ───────── */
  async getLocations(req, res, next) {
    try {
      const { Location } = req.tenantModels;

      const locations = await Location.findAll();

      if (!locations || locations.length === 0) {
        return res.status(404).json({ message: 'No locations found' });
      }

      res.status(200).json(locations);
    } catch (error) {
      next(error);
    }
  }

  /* ───────── GET /api/location/:id ───────── */
  async getLocationById(req, res, next) {
    try {
      const { id } = req.params; // id = locationId
      const { Location } = req.tenantModels;

      const location = await Location.findByPk(id);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      res.status(200).json(location);
    } catch (error) {
      next(error);
    }
  }

  /* ───────── PUT /api/location/:id ───────── */
  async updateLocationById(req, res, next) {
    try {
      const { id } = req.params; // id = locationId
      const updateData = req.body;
      const { Location } = req.tenantModels;

      const location = await Location.findByPk(id);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      await location.update(updateData);

      res.status(200).json({ message: 'Location updated successfully', location });
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
