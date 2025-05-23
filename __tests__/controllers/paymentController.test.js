// __tests__/controllers/paymentController.test.js
import { paymentController } from '../../controllers/paymentController.js';

describe('PaymentController', () => {
  let req, res, next;
  let Payment, Booking;

  beforeEach(() => {
    Payment = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn()
    };
    Booking = {
      findByPk: jest.fn()
    };

    req = {
      params: {},
      body: {},
      tenantModels: { Payment, Booking }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // suppress any console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('creates a payment and updates booking status', async () => {
      req.params.booking_id = 15;
      req.body = { amount: 250, payment_method: 'card' };
      const fakePayment = { id: 99, booking_id: 15, amount: 250, status: 'Pending', payment_method: 'card' };
      const fakeBooking = { update: jest.fn() };

      Payment.create.mockResolvedValue(fakePayment);
      Booking.findByPk.mockResolvedValue(fakeBooking);
      fakeBooking.update.mockResolvedValue({ ...fakeBooking, status: 'Confirmed' });

      await paymentController.createPayment(req, res, next);

      expect(Payment.create).toHaveBeenCalledWith({
        booking_id: 15,
        amount: 250,
        status: 'Pending',
        payment_method: 'card'
      });
      expect(Booking.findByPk).toHaveBeenCalledWith(15);
      expect(fakeBooking.update).toHaveBeenCalledWith({ status: 'Confirmed' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Payment created successfully',
        payment: fakePayment
      });
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('create fail');
      req.params.booking_id = 20;
      req.body = { amount: 100 };
      Payment.create.mockRejectedValue(boom);

      await paymentController.createPayment(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getPayments', () => {
    it('returns all payments', async () => {
      const arr = [{ id: 1 }, { id: 2 }];
      Payment.findAll.mockResolvedValue(arr);

      await paymentController.getPayments(req, res, next);

      expect(Payment.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });

    it('forwards errors to next()', async () => {
      const boom = new Error('findAll fail');
      Payment.findAll.mockRejectedValue(boom);

      await paymentController.getPayments(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deletePayment', () => {
    it('404 if payment not found', async () => {
      req.params.paymentId = 30;
      Payment.findByPk.mockResolvedValue(null);

      await paymentController.deletePayment(req, res, next);

      expect(Payment.findByPk).toHaveBeenCalledWith(30);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment not found' });
    });

    it('destroys and returns success', async () => {
      req.params.paymentId = 31;
      const payment = { destroy: jest.fn() };
      Payment.findByPk.mockResolvedValue(payment);
      payment.destroy.mockResolvedValue();

      await paymentController.deletePayment(req, res, next);

      expect(payment.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      req.params.paymentId = 32;
      const boom = new Error('destroy fail');
      const payment = { destroy: jest.fn().mockRejectedValue(boom) };
      Payment.findByPk.mockResolvedValue(payment);

      await paymentController.deletePayment(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
