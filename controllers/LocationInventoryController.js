class LocationInventoryController {
  /* ───────── POST /api/location-inventory/create ───────── */
  async createInventory(req, res, next) {
    try {
      const { location_id, car_id, quantity_available } = req.body;
      const { LocationInventory } = req.tenantModels;

      const inventory = await LocationInventory.create({
        location_id,
        car_id,
        quantity_available,
      });

      res.status(201).json({ message: 'Inventory record created successfully', inventory });
    } catch (error) {
      next(error);
    }
  }

  /* ───────── GET /api/location-inventory/all ───────── */
  async getInventories(req, res, next) {
    try {
      const { LocationInventory } = req.tenantModels;

      const inventories = await LocationInventory.findAll();

      if (!inventories || inventories.length === 0) {
        return res.status(404).json({ message: 'No inventory records found' });
      }

      res.status(200).json(inventories);
    } catch (error) {
      next(error);
    }
  }
}

export const locationInventoryController = new LocationInventoryController();
