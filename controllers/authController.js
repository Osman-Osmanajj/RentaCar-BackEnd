import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PublicModelService } from '../services/PublicModelService.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

class AuthController {
  constructor() {
    this.publicModelService = new PublicModelService(sequelize);
    this.models = this.publicModelService.getModels();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { User } = this.models;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error while logging in' });
    }
  };

  logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful (token should be deleted on client)' });
  };
}

export const authController = new AuthController();
