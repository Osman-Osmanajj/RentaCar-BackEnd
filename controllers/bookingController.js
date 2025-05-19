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

async deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { Booking } = req.tenantModels;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.destroy();

    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
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

async getCostumersBasedOnbooking(req, res, next) {
  try {
    const { Booking } = req.tenantModels;
    const { User } = req.app.get('models');

    // Define association if not already defined
    if (!Booking.associations.User) {
      Booking.belongsTo(User, { foreignKey: 'user_id' });
    }

    // Fetch only completed bookings with associated User
    const bookings = await Booking.findAll({
      where: { status: 'Completed' },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    // Map to unique customers based on email
    const allCustomers = bookings.map((booking) => ({
      name: booking.User.name,
      email: booking.User.email,
    }));

    const uniqueCustomersMap = new Map();
    allCustomers.forEach((customer) => {
      if (!uniqueCustomersMap.has(customer.email)) {
        uniqueCustomersMap.set(customer.email, customer);
      }
    });

    const uniqueCustomers = Array.from(uniqueCustomersMap.values());

    return res.status(200).json({
      customers: uniqueCustomers,
      bookings: bookings, 
    });

  } catch (error) {
    next(error);
  }
}



async updateBooking(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { Booking } = req.tenantModels;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update(updateData);
    return res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (err) {
    next(err);
  }

}
}

export const bookingController = new BookingController();
