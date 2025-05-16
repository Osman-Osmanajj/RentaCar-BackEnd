import { hashPassword } from '../utils/passwordHash.js';

/* helper so the global error handler can pick the status code */
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UserController {
  async createUser(req, res, next) {
    try {
      const {
        name,
        email,
        password,
        role      = 'Customer',
        tenant_id = null,
      } = req.body;

      const { User } = req.app.get('models');

      // duplicate-email guard
      const dup = await User.findOne({ where: { email } });
      if (dup) {
        return next(new HttpError(409, 'A user with that e-mail already exists'));
      }

      const hashed = await hashPassword(password);
      const user   = await User.create({
        name,
        email,
        password: hashed,
        role,
        tenant_id,
      });

      return res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (err) {
      // race-condition unique violation
      if (
        err.name === 'SequelizeUniqueConstraintError' &&
        err.errors?.[0]?.path === 'email'
      ) {
        return next(new HttpError(409, 'A user with that e-mail already exists'));
      }
      next(err);
    }
  }
 async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { User } = req.app.get('models');

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update(updateData);
      return res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      next(err);
    }
  }
  
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const { User } = req.app.get('models');

      const deleted = await User.destroy({ where: { id } });
      if (!deleted) {
        return next(new HttpError(404, 'User not found'));
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(_req, res, next) {
    try {
      const { User } = _req.app.get('models');
      const users = await User.findAll();
      return res.status(200).json({ users });
    } catch (err) {
      next(err);
    }
  }

  async getUsersById(req, res, next) {
    try {
      const { id } = req.params;
      const { User } = req.app.get('models');

      const user = await User.findByPk(id);
      if (!user) {
        return next(new HttpError(404, 'User not found'));
      }

      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
