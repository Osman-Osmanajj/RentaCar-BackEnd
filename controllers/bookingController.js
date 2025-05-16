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
      } = req.body;

      const { Booking, Car } = req.tenantModels;   

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
      const car = await Car.findByPk(car_id);
      const pricePerDay = car.price;

      function calculatePrice(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        const end   = new Date(endDateStr);

        const diffMs = end - start;
        if (diffMs < 0) {
          throw new Error("End date must be after start date");
        }

        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const fullDays = Math.ceil(diffDays);

        return fullDays * pricePerDay;
      }
      const total_price = calculatePrice(start_date, end_date);

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
