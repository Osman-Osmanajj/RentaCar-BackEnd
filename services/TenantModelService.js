import { initTenantModels } from '../models/initTenantModels.js';

export class TenantModelService {
  constructor(publicModelService) {
    this.publicModelService = publicModelService;
  }

  async getTenantModels(id) {
    const { Tenant } = await this.publicModelService.getModels();

    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new Error('Tenant not found');

    const models = await initTenantModels(tenant.schema_name);

    return { models, schemaName: tenant.schema_name };
  }
}
