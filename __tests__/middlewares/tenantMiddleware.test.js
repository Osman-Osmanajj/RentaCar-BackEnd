// __tests__/middlewares/tenantMiddleware.test.js
import { tenantMiddleware } from '../../middlewares/tenantMiddleware.js';
import * as initModule from '../../models/initTenantModels.js';

jest.mock('../../models/initTenantModels.js', () => ({
  initTenantModels: jest.fn()
}));

describe('tenantMiddleware', () => {
  let req, res, next;
  let Tenant;

  beforeEach(() => {
    Tenant = { findByPk: jest.fn() };
    req = {
      header: jest.fn(),
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

  it('returns 400 if X-Tenant-ID header is missing', async () => {
    req.header.mockReturnValue(undefined);

    await tenantMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith('X-Tenant-ID');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing X-Tenant-ID header' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 404 if tenant not found', async () => {
    req.header.mockReturnValue('123');
    Tenant.findByPk.mockResolvedValue(null);

    await tenantMiddleware(req, res, next);

    expect(Tenant.findByPk).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tenant not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches tenantModels and calls next on success', async () => {
    req.header.mockReturnValue('456');
    const fakeModels = { Booking: {}, Car: {} };
    Tenant.findByPk.mockResolvedValue({ schema_name: 'schema_456' });
    initModule.initTenantModels.mockReturnValue(fakeModels);

    await tenantMiddleware(req, res, next);

    expect(initModule.initTenantModels).toHaveBeenCalledWith('schema_456');
    expect(req.tenantModels).toBe(fakeModels);
    expect(next).toHaveBeenCalled();
  });

  it('forwards errors to next()', async () => {
    req.header.mockReturnValue('789');
    const boom = new Error('DB error');
    Tenant.findByPk.mockRejectedValue(boom);

    await tenantMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(boom);
  });
});
