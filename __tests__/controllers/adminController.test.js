// __tests__/controllers/userAdminController.test.js
import { userAdminController } from '../../controllers/adminController.js';

describe('UserAdminController.createUserAdmin', () => {
  let req, res, next;
  let Tenant, User, UsersAdmin;

  beforeEach(() => {
    // Fresh mocks for each test
    Tenant     = { findByPk: jest.fn() };
    User       = { findByPk: jest.fn() };
    UsersAdmin = { findOrCreate: jest.fn() };

    req = {
      body: { id: 1, tenantid: 2 },
      app: { get: jest.fn(() => ({ Tenant, User, UsersAdmin })) }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    // silence console.error in error‐path test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    jest.clearAllMocks();
  });

  it('404s if tenant not found', async () => {
    Tenant.findByPk.mockResolvedValue(null);

    await userAdminController.createUserAdmin(req, res, next);

    expect(Tenant.findByPk).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tenant not found' });
  });

  it('404s if user not found', async () => {
    Tenant.findByPk.mockResolvedValue({ id: 2 });
    User.findByPk.mockResolvedValue(null);

    await userAdminController.createUserAdmin(req, res, next);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('creates a new admin when none exists', async () => {
    const fakeAdmin = { id: 1, tenantid: 2 };
    Tenant.findByPk.mockResolvedValue({ id: 2 });
    User.findByPk.mockResolvedValue({ id: 1 });
    UsersAdmin.findOrCreate.mockResolvedValue([fakeAdmin, true]);

    await userAdminController.createUserAdmin(req, res, next);

    expect(UsersAdmin.findOrCreate).toHaveBeenCalledWith({
      where:    { id: 1, tenantid: 2 },
      defaults: { id: 1, tenantid: 2 }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:  'User promoted to admin successfully',
      userAdmin: fakeAdmin
    });
  });

  it('returns 200 when admin already exists', async () => {
    const fakeAdmin = { id: 1, tenantid: 2 };
    Tenant.findByPk.mockResolvedValue({ id: 2 });
    User.findByPk.mockResolvedValue({ id: 1 });
    UsersAdmin.findOrCreate.mockResolvedValue([fakeAdmin, false]);

    await userAdminController.createUserAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message:  'User is already an admin for this tenant',
      userAdmin: fakeAdmin
    });
  });

  it('forwards errors to next()', async () => {
    const boom = new Error('database down');
    Tenant.findByPk.mockRejectedValue(boom);

    await userAdminController.createUserAdmin(req, res, next);

    expect(console.error).toHaveBeenCalledWith('Error creating user admin:', boom);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
