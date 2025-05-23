// __tests__/utils/mockExpress.js
export const mockRequest = () => ({
  body: {},
  params: {},
  headers: {},
  user: null,
  tenantModels: {},
  app: { get: () => ({}) }
});

export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
