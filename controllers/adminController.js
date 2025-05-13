import { sequelize } from '../config/database.js';
import { PublicModelService } from '../services/PublicModelService.js';

class UserAdminController {
  async createUserAdmin(req, res) {
    try {
      const { id, tenantid } = req.body;
    const publicModelService = new PublicModelService(sequelize);
    const models = publicModelService.getModels();

    const { UsersAdmin,User } = models;
    console.log('user:', User);
    

    console.log('UserAdmin Model:', UsersAdmin);


      const userAdmin = await UsersAdmin.create({
        id,
        tenantid,
      });

      res.status(201).json({
        message: 'User admin created successfully',
        userAdmin,
      });
    } catch (error) {
      console.error('Error creating user admin:', error);
      res.status(500).json({
        message: 'Internal server error while creating user admin',
      });
    }
  }

}

export const userAdminController = new UserAdminController();
