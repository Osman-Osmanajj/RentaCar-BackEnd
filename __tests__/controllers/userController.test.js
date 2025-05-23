// __tests__/controllers/userController.test.js
import bcrypt from 'bcrypt';
import { userController } from '../../controllers/userController.js';
import { hashPassword } from '../../utils/passwordHash.js';

// Mock the hashPassword util
jest.mock('../../utils/passwordHash.js', () => ({
  hashPassword: jest.fn()
}));

describe('UserController', () => {
  let req, res, next;
  let User;

  beforeEach(() => {
    // Stub User model methods
    User = {
      findOne:  jest.fn(),
      create:   jest.fn(),
      findByPk: jest.fn(),
      destroy:  jest.fn(),
      findAll:  jest.fn()
    };

    req = {
      params: {},
      body: {},
      app: { get: () => ({ User }) },
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    // Stub bcrypt.compare
    bcrypt.compare = jest.fn();

    // Silence console.error from controllers
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('calls next with 409 if email already exists', async () => {
      req.body = { name: 'A', email: 'a@b', password: 'pass' };
      User.findOne.mockResolvedValue({ id: 1 });

      await userController.createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'a@b' } });
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('A user with that e-mail already exists');
    });

    it('creates user on success', async () => {
      req.body = { name: 'Bob', email: 'bob@x', password: 'secret', role: 'Admin', tenant_id: 5 };
      User.findOne.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashedSecret');
      const fakeUser = { id: 2, ...req.body, password: 'hashedSecret' };
      User.create.mockResolvedValue(fakeUser);

      await userController.createUser(req, res, next);

      expect(hashPassword).toHaveBeenCalledWith('secret');
      expect(User.create).toHaveBeenCalledWith({
        name: 'Bob',
        email: 'bob@x',
        password: 'hashedSecret',
        role: 'Admin',
        tenant_id: 5
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: fakeUser
      });
    });

    it('handles unique constraint error on email', async () => {
      req.body = { name: 'C', email: 'c@d', password: 'pw' };
      User.findOne.mockResolvedValue(null);
      const uniqueErr = new Error();
      uniqueErr.name = 'SequelizeUniqueConstraintError';
      uniqueErr.errors = [{ path: 'email' }];
      hashPassword.mockResolvedValue('h');
      User.create.mockRejectedValue(uniqueErr);

      await userController.createUser(req, res, next);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('A user with that e-mail already exists');
    });
  });

  describe('updateUser', () => {
    it('404 if oldpassword provided but user not found', async () => {
      req.params.id = '10';
      req.body = { oldpassword: 'old', newPassword: 'new' };
      User.findByPk.mockResolvedValue(null);

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('401 if oldpassword invalid', async () => {
      req.params.id = '11';
      req.body = { oldpassword: 'wrong', newPassword: 'new' };
      const user = { password: 'hashed', update: jest.fn() };
      User.findByPk.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await userController.updateUser(req, res, next);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('updates password and other data when oldpassword valid', async () => {
      req.params.id = '12';
      req.body = { oldpassword: 'oldpw', newPassword: 'newpw', role: 'Customer' };
      const userBefore = { password: 'hashOld', update: jest.fn() };
      // First findByPk for oldpassword branch:
      User.findByPk
        .mockResolvedValueOnce(userBefore) 
        // Second findByPk for final update:
        .mockResolvedValueOnce(userBefore);
      bcrypt.compare.mockResolvedValue(true);
      hashPassword.mockResolvedValue('hashNew');
      userBefore.update.mockResolvedValue({ ...userBefore, password: 'hashNew' });

      await userController.updateUser(req, res, next);

      // password update
      expect(userBefore.update).toHaveBeenCalledWith({ password: 'hashNew' });
      // then final update with full body
      expect(userBefore.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully', user: userBefore });
    });

    it('updates non-password fields when no oldpassword provided', async () => {
      req.params.id = '13';
      req.body = { role: 'Admin' };
      const user = { update: jest.fn() };
      User.findByPk.mockResolvedValue(user);

      await userController.updateUser(req, res, next);

      expect(user.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully', user });
    });

    it('forwards errors during update', async () => {
      req.params.id = '14';
      req.body = { role: 'X' };
      const boom = new Error('fail');
      User.findByPk.mockRejectedValue(boom);

      await userController.updateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteUser', () => {
    it('404 if no rows deleted', async () => {
      req.params.id = '20';
      User.destroy.mockResolvedValue(0);

      await userController.deleteUser(req, res, next);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('User not found');
    });

    it('200 when delete succeeds', async () => {
      req.params.id = '21';
      User.destroy.mockResolvedValue(1);

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });
  });

  describe('getUsers', () => {
    it('returns users array', async () => {
      const arr = [{ id: 1 }];
      User.findAll.mockResolvedValue(arr);

      await userController.getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: arr });
    });

    it('forwards findAll errors', async () => {
      const boom = new Error('fail');
      User.findAll.mockRejectedValue(boom);

      await userController.getUsers(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getUsersById', () => {
    it('404 if not found', async () => {
      req.params.id = '30';
      User.findByPk.mockResolvedValue(null);

      await userController.getUsersById(req, res, next);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('User not found');
    });

    it('200 with user when found', async () => {
      req.params.id = '31';
      const fake = { id: 31 };
      User.findByPk.mockResolvedValue(fake);

      await userController.getUsersById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: fake });
    });

    it('forwards findByPk errors', async () => {
      const boom = new Error('fail');
      req.params.id = '32';
      User.findByPk.mockRejectedValue(boom);

      await userController.getUsersById(req, res, next);
      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
