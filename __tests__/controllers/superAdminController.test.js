import { superAdminController } from '../../controllers/superAdminController';
import { mockRequest, mockResponse } from '../utils/mockExpress.js';
import { jest } from '@jest/globals';
import * as initTenantModelsModule from '../../models/initTenantModels';

describe('SuperAdminController', () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('getAllTenants', () => {
    it('returns all tenants', async () => {
      const tenants = [{ id: 1 }, { id: 2 }];
      req.app.get = () => ({ Tenant: { findAll: jest.fn().mockResolvedValue(tenants) } });

      await superAdminController.getAllTenants(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ tenants });
    });

    it('forwards errors', async () => {
      const boom = new Error('fail');
      req.app.get = () => ({ Tenant: { findAll: jest.fn().mockRejectedValue(boom) } });

      await superAdminController.getAllTenants(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('createTenant', () => {
    it('creates a tenant', async () => {
      req.body = {
        name: 'T1',
        email: 'a@b',
        phone: '123',
        address: 'X',
        city: 'Y',
        country: 'Z',
      };
      const fakeTenant = { ...req.body, schema_name: 'tenant_t1' };
      req.app.get = () => ({ Tenant: { create: jest.fn().mockResolvedValue(fakeTenant) } });

      await superAdminController.createTenant(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tenant created', tenant: fakeTenant });
    });

    it('forwards create errors', async () => {
      const boom = new Error('fail');
      req.body = {
        name: 'T1',
        email: 'a@b',
        phone: '123',
        address: 'X',
        city: 'Y',
        country: 'Z',
      };
      req.app.get = () => ({ Tenant: { create: jest.fn().mockImplementation(() => { throw boom; }) } });

      await superAdminController.createTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('updateTenant', () => {
    it('404 if not found', async () => {
      req.params = { id: 9 };
      req.app.get = () => ({ Tenant: { findByPk: jest.fn().mockResolvedValue(null) } });

      await superAdminController.updateTenant(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tenant not found' });
    });

    it('updates and returns tenant', async () => {
      req.params = { id: 9 };
      req.body = { phone: '999' };
      const tenant = { update: jest.fn(), id: 9 };
      req.app.get = () => ({ Tenant: { findByPk: jest.fn().mockResolvedValue(tenant) } });

      await superAdminController.updateTenant(req, res, next);
      expect(tenant.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ message: 'Updated', tenant });
    });

    it('forwards update errors', async () => {
      const boom = new Error('fail');
      req.params = { id: 9 };
      req.app.get = () => ({ Tenant: { findByPk: jest.fn().mockRejectedValue(boom) } });

      await superAdminController.updateTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteTenant', () => {
    it('404 if none deleted', async () => {
      req.params = { id: 5 };
      req.app.get = () => ({ Tenant: { destroy: jest.fn().mockResolvedValue(0) } });

      await superAdminController.deleteTenant(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tenant not found' });
    });

    it('deletes and returns success', async () => {
      req.params = { id: 5 };
      req.app.get = () => ({ Tenant: { destroy: jest.fn().mockResolvedValue(1) } });

      await superAdminController.deleteTenant(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
    });

    it('forwards destroy errors', async () => {
      const boom = new Error('fail');
      req.params = { id: 5 };
      req.app.get = () => ({ Tenant: { destroy: jest.fn().mockRejectedValue(boom) } });

      await superAdminController.deleteTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      req.app.get = () => ({ User: { findAll: jest.fn().mockResolvedValue(users) } });

      await superAdminController.getAllUsers(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ users });
    });

    it('forwards errors', async () => {
      const boom = new Error('fail');
      req.app.get = () => ({ User: { findAll: jest.fn().mockRejectedValue(boom) } });

      await superAdminController.getAllUsers(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getAllBookings', () => {
    it('aggregates bookings across tenants', async () => {
      const tenants = [
        { id: 1, schema_name: 'tenant_1' },
        { id: 2, schema_name: 'tenant_2' },
      ];
      const bookings1 = [{ id: 'a' }];
      const bookings2 = [{ id: 'b' }];

      jest.spyOn(initTenantModelsModule, 'initTenantModels')
        .mockImplementation((schema) => ({
          Booking: {
            findAll: jest.fn().mockResolvedValue(
              schema === 'tenant_1' ? bookings1 : bookings2
            ),
          },
        }));

      req.app.get = () => ({
        Tenant: { findAll: jest.fn().mockResolvedValue(tenants) },
      });

      await superAdminController.getAllBookings(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        bookings: [
          { ...bookings1[0], tenant_id: 1 },
          { ...bookings2[0], tenant_id: 2 },
        ],
      });
    });

    it('forwards aggregation errors', async () => {
      const boom = new Error('fail');
      req.app.get = () => ({
        Tenant: { findAll: jest.fn().mockRejectedValue(boom) },
      });

      await superAdminController.getAllBookings(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
