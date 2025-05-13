import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';


class BookingController {
  async createBooking(req, res) {
    try {
        const { id, userid } = req.params;
        const { car_id, start_date, end_date, status, total_price } = req.body;

        const publicModelService = new PublicModelService(sequelize);
        const tenantModelService = new TenantModelService(publicModelService);
        const { models, schemaName } = await tenantModelService.getTenantModels(id);
        const { Booking } = models;

      console.log("Tenant ID:", id);
      console.log("Schema Name:", schemaName);
      console.log("User ID:", userid);

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const booking = await Booking.create({
        user_id: userid,
        car_id,
        start_date,
        end_date,
        status,
        total_price,
      });

      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Internal server error while creating booking' });
    }
  }

}

export const bookingController = new BookingController();
