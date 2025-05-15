class PaymentController {
  /* ───────── POST /api/payment/create ───────── */
  async createPayment(req, res, next) {
    try {
      const { booking_id, amount, status, payment_method } = req.body;
      const { Payment } = req.tenantModels;

      const payment = await Payment.create({
        booking_id,
        amount,
        status,
        payment_method,
      });

      return res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (err) {
      next(err);
    }
  }

  /* ───────── GET /api/payment/all ───────── */
  async getPayments(req, res, next) {
    try {
      const { Payment } = req.tenantModels;

      const payments = await Payment.findAll();
      return res.status(200).json(payments);
    } catch (err) {
      next(err);
    }
  }

  /* ───────── DELETE /api/payment/:paymentId ───────── */
  async deletePayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { Payment } = req.tenantModels;

      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await payment.destroy();
      return res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
