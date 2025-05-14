// controllers/userController.js
import { hashPassword } from '../utils/passwordHash.js';

/* lightweight helper so global errorHandler can pick statusCode */
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UserController {
  /**
   * POST /api/user
   * Body { name, email, password, role? = "Customer", tenant_id }
   */
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

      //duplicate-email guard 
      const duplicate = await User.findOne({ where: { email } });
      if (duplicate) {
        // Hand off to global error middleware → JSON 409
        return next(new HttpError(409, 'A user with that e-mail already exists'));
      }

      //hash + insert
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
      
      if (
        err.name === 'SequelizeUniqueConstraintError' &&
        err.errors?.[0]?.path === 'email'
      ) {
        return next(new HttpError(409, 'A user with that e-mail already exists'));
      }

      
      next(err);
    }
  }
}

export const userController = new UserController();
