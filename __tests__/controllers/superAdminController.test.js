// __tests__/controllers/superAdminController.test.js
import { superAdminController } from '../../controllers/superAdminController.js';
import * as initModule from '../../models/initTenantModels.js';

jest.mock('../../models/initTenantModels.js', () => ({
  initTenantModels: jest.fn()
}));

describe('SuperAdminController', () => {
  let req, res, next;
  let Tenant, User;

  beforeEach(() => {
    Tenant = {
      findAll:   jest.fn(),
      create:    jest.fn(),
      findByPk:  jest.fn(),
      destroy:   jest.fn()
    };
    User = { findAll: jest.fn() };

    req = {
      params: {},
      body: {},
      app: { get: jest.fn(() => ({ Tenant, User })) }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTenants', () => {
    it('returns all tenants', async () => {
      const arr = [{ id:1 }, { id:2 }];
      Tenant.findAll.mockResolvedValue(arr);

      await superAdminController.getAllTenants(req, res, next);

      expect(Tenant.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ tenants: arr });
    });

    it('forwards errors', async () => {
      const boom = new Error('fail');
      Tenant.findAll.mockRejectedValue(boom);

      await superAdminController.getAllTenants(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('createTenant', () => {
    it('creates a tenant', async () => {
      req.body = { name:'T1', email:'a@b', phone:'123', address:'X', city:'Y', country:'Z' };
      const fake = { id: 3, ...req.body };
      Tenant.create.mockResolvedValue(fake);

      await superAdminController.createTenant(req, res, next);

      expect(Tenant.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message:'Tenant created', tenant: fake });
    });

    it('forwards create errors', async () => {
      const boom = new Error('nope');
      Tenant.create.mockRejectedValue(boom);

      await superAdminController.createTenant(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('updateTenant', () => {
    it('404 if not found', async () => {
      req.params.id = 5;
      req.body = { name:'New' };
      Tenant.findByPk.mockResolvedValue(null);

      await superAdminController.updateTenant(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message:'Tenant not found' });
    });

    it('updates and returns tenant', async () => {
      req.params.id = 6;
      req.body = { city:'C2' };
      const t = { update: jest.fn().mockResolvedValue({ id:6, city:'C2' }) };
      Tenant.findByPk.mockResolvedValue(t);

      await superAdminController.updateTenant(req, res, next);

      expect(t.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ message:'Updated', tenant: t });
    });

    it('forwards update errors', async () => {
      const boom = new Error('oops');
      req.params.id = 7;
      Tenant.findByPk.mockRejectedValue(boom);

      await superAdminController.updateTenant(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteTenant', () => {
    it('404 if none deleted', async () => {
      req.params.id = 8;
      Tenant.destroy.mockResolvedValue(0);

      await superAdminController.deleteTenant(req, res, next);

      expect(Tenant.destroy).toHaveBeenCalledWith({ where:{ id:8 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message:'Tenant not found' });
    });

    it('deletes and returns success', async () => {
      req.params.id = 9;
      Tenant.destroy.mockResolvedValue(1);

      await superAdminController.deleteTenant(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ message:'Deleted' });
    });

    it('forwards destroy errors', async () => {
      const boom = new Error('bad');
      req.params.id = 10;
      Tenant.destroy.mockRejectedValue(boom);

      await superAdminController.deleteTenant(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      const arr = [{ id:1 }];
      User.findAll.mockResolvedValue(arr);

      await superAdminController.getAllUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ users: arr });
    });

    it('forwards errors', async () => {
      const boom = new Error('fail');
      User.findAll.mockRejectedValue(boom);

      await superAdminController.getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getAllBookings', () => {
    it('aggregates bookings across tenants', async () => {
      const tenants = [
        { id: 1, schema_name: 's1' },
        { id: 2, schema_name: 's2' }
      ];
      Tenant.findAll.mockResolvedValue(tenants);

      const b1 = [{ id: 101 }];
      const b2 = [{ id: 201 }, { id:202 }];
      initModule.initTenantModels
        .mockImplementationOnce(() => ({ Booking: { findAll: jest.fn().mockResolvedValue(b1) } }))
        .mockImplementationOnce(() => ({ Booking: { findAll: jest.fn().mockResolvedValue(b2) } }));

      await superAdminController.getAllBookings(req, res, next);

      expect(initModule.initTenantModels).toHaveBeenNthCalledWith(1, 's1');
      expect(initModule.initTenantModels).toHaveBeenNthCalledWith(2, 's2');
      // each record gets tenant_id attached
      expect(res.json).toHaveBeenCalledWith({
        bookings: [
          { id:101, tenant_id:1 },
          { id:201, tenant_id:2 },
          { id:202, tenant_id:2 }
        ]
      });
    });

    it('forwards aggregation errors', async () => {
      const boom = new Error('agg fail');
      Tenant.findAll.mockResolvedValue([{ id:3, schema_name:'s3' }]);
      initModule.initTenantModels.mockImplementation(() => ({ Booking: { findAll: jest.fn().mockRejectedValue(boom) } }));

      await superAdminController.getAllBookings(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
