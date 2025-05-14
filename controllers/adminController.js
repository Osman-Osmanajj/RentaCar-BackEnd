export class UserAdminController {
  
  async createUserAdmin(req, res, next) {
    try {
      const { id, tenantid } = req.body;
      const { User, UsersAdmin, Tenant } = req.app.get('models');

      //validations
      const tenant = await Tenant.findByPk(tenantid);
      if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      //create / upsert admin record
      const [userAdmin, created] = await UsersAdmin.findOrCreate({
        where:   { id, tenantid },
        defaults:{ id, tenantid }
      });

      return res.status(created ? 201 : 200).json({
        message: created
          ? 'User promoted to admin successfully'
          : 'User is already an admin for this tenant',
        userAdmin,
      });
    } catch (err) {
      console.error('Error creating user admin:', err);
      next(err);                           
    }
  }
}

export const userAdminController = new UserAdminController();
