// __tests__/services/PublicModelService.test.js
import { PublicModelService } from '../../services/PublicModelService.js';
import * as initModule from '../../models/initPublicModels.js';

jest.mock('../../models/initPublicModels.js', () => ({
  initPublicModels: jest.fn()
}));

describe('PublicModelService', () => {
  let fakeSequelize;
  let fakeModels;

  beforeEach(() => {
    fakeSequelize = {};                   // dummy sequelize instance
    fakeModels    = { User: {}, Car: {} }; // dummy returned models
    initModule.initPublicModels.mockReturnValue(fakeModels);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws if no sequelize instance is provided', () => {
    expect(() => new PublicModelService()).toThrow('Sequelize instance is required');
  });

  it('calls initPublicModels with the provided sequelize instance and stores models', () => {
    const svc = new PublicModelService(fakeSequelize);

    expect(initModule.initPublicModels).toHaveBeenCalledWith(fakeSequelize);
    expect(svc.sequelize).toBe(fakeSequelize);
    expect(svc.models).toBe(fakeModels);
  });

  it('getModels returns the models object', () => {
    const svc = new PublicModelService(fakeSequelize);
    expect(svc.getModels()).toBe(fakeModels);
  });
});
