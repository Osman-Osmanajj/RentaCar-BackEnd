// __tests__/services/TenantModelService.test.js
import { TenantModelService } from '../../services/TenantModelService.js';
import * as initModule from '../../models/initTenantModels.js';

jest.mock('../../models/initTenantModels.js', () => ({
  initTenantModels: jest.fn()
}));

describe('TenantModelService', () => {
  let fakePublicSvc;
  let fakeTenantModel;
  let service;

  beforeEach(() => {
    // stub out a publicModelService whose getModels returns a Tenant model stub
    fakeTenantModel = { findByPk: jest.fn() };
    fakePublicSvc   = { getModels: jest.fn().mockResolvedValue({ Tenant: fakeTenantModel }) };
    service         = new TenantModelService(fakePublicSvc);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws if tenant not found', async () => {
    fakeTenantModel.findByPk.mockResolvedValue(null);

    await expect(service.getTenantModels(123))
      .rejects
      .toThrow('Tenant not found');

    expect(fakePublicSvc.getModels).toHaveBeenCalled();
    expect(fakeTenantModel.findByPk).toHaveBeenCalledWith(123);
    expect(initModule.initTenantModels).not.toHaveBeenCalled();
  });

  it('returns models and schemaName on success', async () => {
    const fakeTenant = { schema_name: 'schema_42' };
    const fakeModels = { Booking: {}, Car: {} };

    fakeTenantModel.findByPk.mockResolvedValue(fakeTenant);
    initModule.initTenantModels.mockReturnValue(fakeModels);

    const result = await service.getTenantModels(42);

    expect(fakePublicSvc.getModels).toHaveBeenCalled();
    expect(fakeTenantModel.findByPk).toHaveBeenCalledWith(42);
    expect(initModule.initTenantModels).toHaveBeenCalledWith('schema_42');
    expect(result).toEqual({
      models:     fakeModels,
      schemaName: 'schema_42'
    });
  });
});
