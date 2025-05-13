import { initPublicModels } from '../models/initPublicModels.js';

export class PublicModelService {
  constructor(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('Sequelize instance is required');
    }
    this.sequelize = sequelizeInstance;
    this.models = initPublicModels(this.sequelize);
  }

  getModels() {
    return this.models;
  }
}
