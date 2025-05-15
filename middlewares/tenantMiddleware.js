
async function tenantMiddleware(req, res, next) {
  const tenantId = req.header('X-Tenant-ID');
  if (!tenantId) {
    return res.status(400).json({ error: 'Missing X-Tenant-ID header' });
  }

  try {
    const { Tenant } = req.app.get('models');
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    req.tenantModels = initTenantModels(tenant.schema_name);
    next();
  } catch (err) {
    next(err);
  }
}
export { tenantMiddleware };