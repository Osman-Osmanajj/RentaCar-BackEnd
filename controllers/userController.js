import { sequelize } from '../config/database.js';
import { hashPassword } from '../utils/passwordHash.js';
import { PublicModelService } from '../services/PublicModelService.js';

class UserController {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      console.log("User Data:", req.body);

      const hashedPassword = await hashPassword(password);
      console.log("Password Hash:", hashedPassword);

      const publicModelService = new PublicModelService(sequelize);
      const models = publicModelService.getModels();
      const { User } = models;

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const publicModelService = new PublicModelService(sequelize);
      const models = publicModelService.getModels();
      const { User } = models;

      const user = await User.destroy({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getUsers(req,res){
    try {
      const publicModelService = new PublicModelService(sequelize);
      const models = publicModelService.getModels();
      const { User } = models;

      const users = await User.findAll();

      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  async getUsersById(req,res){
    try {
      const { id } = req.params;
      const publicModelService = new PublicModelService(sequelize);
      const models = publicModelService.getModels();
      const { User } = models;

      const user = await User.findOne({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

}

export const userController = new UserController();
