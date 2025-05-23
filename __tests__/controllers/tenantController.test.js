// __tests__/controllers/tenantController.test.js
import { tenantController } from '../../controllers/tenantController.js';
import { sequelize } from '../../config/database.js';

jest.mock('../../config/database.js', () => ({
  sequelize: { query: jest.fn() }
}));

describe('TenantController', () => {
  let req, res, next, Tenant;

  beforeEach(() => {
    Tenant = {
      findOne: jest.fn(),
      create:  jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn()
    };

    req = {
      params: {},
      body: {},
      app: { get: jest.fn(() => ({ Tenant })) }
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

  describe('createTenant', () => {
    it('passes conflict error when email exists', async () => {
      req.body = { name: 'Acme', email: 'a@b', phone: 'p', address: 'addr', city: 'C', country: 'X' };
      Tenant.findOne.mockResolvedValue({ id: 1 });

      await tenantController.createTenant(req, res, next);

      expect(Tenant.findOne).toHaveBeenCalledWith({ where: { email: 'a@b' } });
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('A tenant with that e-mail already exists');
    });

    it('creates tenant, calls schema SQL, and returns 201', async () => {
      const body = { name: 'Acme', email: 'a@b', phone: 'p', address: 'addr', city: 'C', country: 'X' };
      req.body = body;
      const created = { id: 2, ...body };
      Tenant.findOne.mockResolvedValue(null);
      Tenant.create.mockResolvedValue(created);
      sequelize.query.mockResolvedValue();

      await tenantController.createTenant(req, res, next);

      expect(Tenant.findOne).toHaveBeenCalledWith({ where: { email: 'a@b' } });
      expect(Tenant.create).toHaveBeenCalledWith({
        ...body,
        schema_name: 'tenant_acme'
      });
      expect(sequelize.query).toHaveBeenCalledWith(
        'SELECT public.create_tenant_schema(:tenantId);',
        { replacements: { tenantId: 2 } }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tenant created successfully',
        tenant: created
      });
    });

    it('forwards SQL errors to next()', async () => {
      req.body = { name: 'X', email: 'e@f', phone: 'p', address: '', city: '', country: '' };
      Tenant.findOne.mockResolvedValue(null);
      Tenant.create.mockResolvedValue({ id: 3, ...req.body });
      const boom = new Error('SQL fail');
      sequelize.query.mockRejectedValue(boom);

      await tenantController.createTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getTenants', () => {
    it('returns 200 with tenants array', async () => {
      const arr = [{ id: 1 }];
      Tenant.findAll.mockResolvedValue(arr);

      await tenantController.getTenants(req, res, next);

      expect(Tenant.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tenants: arr });
    });

    it('forwards findAll errors', async () => {
      const boom = new Error('fail');
      Tenant.findAll.mockRejectedValue(boom);

      await tenantController.getTenants(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getTenantById', () => {
    it('404 when not found', async () => {
      req.params.id = 5;
      Tenant.findByPk.mockResolvedValue(null);

      await tenantController.getTenantById(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Tenant not found');
    });

    it('200 when found', async () => {
      req.params.id = 6;
      const tenant = { id: 6, name: 'N' };
      Tenant.findByPk.mockResolvedValue(tenant);

      await tenantController.getTenantById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tenant });
    });

    it('forwards findByPk errors', async () => {
      req.params.id = 7;
      const boom = new Error('db fail');
      Tenant.findByPk.mockRejectedValue(boom);

      await tenantController.getTenantById(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('updateTenant', () => {
    it('404 when not found', async () => {
      req.params.id = 8;
      req.body = { city: 'Z' };
      Tenant.findByPk.mockResolvedValue(null);

      await tenantController.updateTenant(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tenant not found' });
    });

    it('updates and returns 200', async () => {
      req.params.id = 9;
      const t = { update: jest.fn() };
      req.body = { city: 'New City' };
      Tenant.findByPk.mockResolvedValue(t);

      await tenantController.updateTenant(req, res, next);

      expect(t.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tenant updated successfully',
        tenant: t
      });
    });

    it('forwards update errors', async () => {
      req.params.id = 10;
      const boom = new Error('upd fail');
      Tenant.findByPk.mockRejectedValue(boom);

      await tenantController.updateTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteTenant', () => {
    it('404 when none destroyed', async () => {
      req.params.id = 11;
      Tenant.destroy.mockResolvedValue(0);

      await tenantController.deleteTenant(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Tenant not found');
    });

    it('200 when deleted', async () => {
      req.params.id = 12;
      Tenant.destroy.mockResolvedValue(1);

      await tenantController.deleteTenant(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tenant deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      req.params.id = 13;
      const boom = new Error('del fail');
      Tenant.destroy.mockRejectedValue(boom);

      await tenantController.deleteTenant(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
