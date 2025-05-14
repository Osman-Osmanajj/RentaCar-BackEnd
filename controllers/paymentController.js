import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class PaymentController {
  async createPayment(req, res) {
    try {
      const { id } = req.params; // tenant ID
      const { booking_id, amount, status, payment_method } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Payment } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const payment = await Payment.create({
        booking_id,
        amount,
        status,
        payment_method,
      });

      res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Internal server error while creating payment' });
    }
  }

  async getPayments(req, res) {
    try {
      const { id } = req.params;
      
      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Payment } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const payments = await Payment.findAll();

      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Internal server error while fetching payments' });
    }
  }

  async deletePayment(req, res) {
    try {
      const { id, paymentId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Payment } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const payment = await Payment.findByPk(paymentId);

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await payment.destroy();

      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ message: 'Internal server error while deleting payment' });
    }
  }
}

export const paymentController = new PaymentController();
