import Sequelize from 'sequelize';
const { Op } = Sequelize;

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BookingController {
  
  async createBooking(req, res, next) {
    try {
      const { userId } = req.params;
      const {
        car_id,
        start_date,
        end_date,
        status = 'Pending',
        total_price,
      } = req.body;

      const { Booking } = req.tenantModels;   

      //overlap guard
      const overlapping = await Booking.findOne({
        where: {
          car_id,
          status: { [Op.ne]: 'Cancelled' },
          start_date: { [Op.lte]: end_date   },   
          end_date:   { [Op.gte]: start_date },   
        },
      });
      

      if (overlapping) {
        return next(
          new HttpError(
            409,
            'Car is already booked for some or all of the requested period'
          )
        );
      }

      //create booking 
      const booking = await Booking.create({
        user_id: userId,
        car_id,
        start_date,
        end_date,
        status,
        total_price,
      });

      return res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

 async getAllBookings(req, res, next) {
  try {
    const { Booking,Car } = req.tenantModels;
    const { User } = req.app.get('models'); 

    
    if (!Booking.associations.User) {
      Booking.belongsTo(User, { foreignKey: 'user_id' });
    }

    const bookings = await Booking.findAll({
      include: [
        {
          model: Car,
          attributes: ['make']
        },
        {
          model: User,
          attributes: ['name']
        }
      ],

    });

    return res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
}

}

export const bookingController = new BookingController();
