// __tests__/controllers/bookingController.test.js
import { bookingController } from '../../controllers/bookingController.js';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

describe('BookingController', () => {
  let req, res, next;
  let Booking, Car, CarImage, User;

  beforeEach(() => {
    Booking  = { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), associations: {}, belongsTo: jest.fn() };
    Car      = { findByPk: jest.fn(), price: 100, hasMany: jest.fn() };
    CarImage = {};
    User     = {};

    req = {
      params: {},
      body: {},
      tenantModels: { Booking, Car, CarImage },
      app: { get: () => ({ User }) }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('passes overlap error to next()', async () => {
      req.params.userId = 7;
      req.body = { car_id: 3, start_date: '2025-06-10', end_date: '2025-06-15' };
      Booking.findOne.mockResolvedValue({}); // overlapping
      await bookingController.createBooking(req, res, next);

      expect(Booking.findOne).toHaveBeenCalledWith({
        where: {
          car_id: 3,
          status: { [Op.ne]: 'Cancelled' },
          start_date: { [Op.lte]: '2025-06-15' },
          end_date:   { [Op.gte]: '2025-06-10' }
        }
      });
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toHaveProperty('statusCode', 409);
      expect(err.message).toMatch(/already booked/);
    });

    it('throws date error when end before start', async () => {
      req.params.userId = 7;
      req.body = { car_id: 3, start_date: '2025-06-20', end_date: '2025-06-15' };
      Booking.findOne.mockResolvedValue(null);
      Car.findByPk.mockResolvedValue({ price: 50 });
      // total price calc will throw
      await bookingController.createBooking(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/End date must be after start date/);
    });

    it('creates booking on valid data', async () => {
      req.params.userId = 7;
      req.body = { car_id: 3, start_date: '2025-06-10', end_date: '2025-06-12', status: 'Confirmed' };
      Booking.findOne.mockResolvedValue(null);
      Car.findByPk.mockResolvedValue({ price: 100 });
      const fakeBooking = { id: 99, ...req.body, user_id: 7, total_price: 2 * 100 };
      Booking.create.mockResolvedValue(fakeBooking);

      await bookingController.createBooking(req, res, next);

      expect(Booking.create).toHaveBeenCalledWith({
        user_id:     7,
        car_id:      3,
        start_date:  '2025-06-10',
        end_date:    '2025-06-12',
        status:      'Confirmed',
        total_price: 200
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking created successfully',
        booking: fakeBooking
      });
    });
  });

  describe('getUserBookings', () => {
    it('returns an array of bookings', async () => {
      req.params.userId = 5;
      // clear associations so each branch runs
      Booking.associations = {};
      Car.hasMany = jest.fn();
      const fake = [{ id: 1 }, { id: 2 }];
      Booking.findAll.mockResolvedValue(fake);

      await bookingController.getUserBookings(req, res, next);

      expect(Booking.belongsTo).toHaveBeenCalledTimes(2);
      expect(Car.hasMany).toHaveBeenCalled();
      expect(Booking.findAll).toHaveBeenCalledWith({
        where: { user_id: 5 },
        include: [
          { model: Car, attributes: ['make', 'model'] },
          { model: User, attributes: ['name'] },
          { model: CarImage, attributes: ['image_url'] },
        ],
        order: [['start_date', 'DESC']]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });
  });

  describe('deleteBooking', () => {
    it('404 if not found', async () => {
      req.params.id = 42;
      Booking.findByPk.mockResolvedValue(null);

      await bookingController.deleteBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('destroys and returns success', async () => {
      req.params.id = 42;
      const booking = { destroy: jest.fn() };
      Booking.findByPk.mockResolvedValue(booking);

      await bookingController.deleteBooking(req, res, next);

      expect(booking.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking deleted successfully' });
    });
  });

  describe('getAllBookings', () => {
    it('updates expired bookings then returns all', async () => {
      Booking.associations = {};
      const now = new Date();
      const past = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const future = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const b1 = { end_date: past, status: 'Pending', update: jest.fn() };
      const b2 = { end_date: future, status: 'Pending', update: jest.fn() };
      const b3 = { end_date: past, status: 'Completed', update: jest.fn() };
      Booking.findAll.mockResolvedValue([b1, b2, b3]);

      await bookingController.getAllBookings(req, res, next);

      expect(Booking.belongsTo).toHaveBeenCalledWith(User, { foreignKey: 'user_id' });
      expect(b1.update).toHaveBeenCalledWith({ status: 'Completed' });
      expect(b2.update).not.toHaveBeenCalled();
      expect(b3.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([b1, b2, b3]);
    });
  });

  describe('getCostumersBasedOnbooking', () => {
    it('returns unique customers and bookings', async () => {
      Booking.associations = {};
      const bookings = [
        { User: { name: 'A', email: 'a@x' } },
        { User: { name: 'B', email: 'b@x' } },
        { User: { name: 'A', email: 'a@x' } }
      ];
      Booking.findAll.mockResolvedValue(bookings);

      await bookingController.getCostumersBasedOnbooking(req, res, next);

      expect(Booking.belongsTo).toHaveBeenCalledWith(User, { foreignKey: 'user_id' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        customers: [
          { name: 'A', email: 'a@x' },
          { name: 'B', email: 'b@x' }
        ],
        bookings
      });
    });
  });

  describe('updateBooking', () => {
    it('404 if not found', async () => {
      req.params.id = 77;
      req.body = { status: 'Cancelled' };
      Booking.findByPk.mockResolvedValue(null);

      await bookingController.updateBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('updates and returns success', async () => {
      req.params.id = 77;
      req.body = { status: 'Cancelled' };
      const booking = { update: jest.fn().mockResolvedValue({ id: 77, status: 'Cancelled' }) };
      Booking.findByPk.mockResolvedValue(booking);

      await bookingController.updateBooking(req, res, next);

      expect(booking.update).toHaveBeenCalledWith({ status: 'Cancelled' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking updated successfully',
        booking: booking
      });
    });
  });
});
