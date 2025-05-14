export function errorHandler(err, _req, res, _next) {
    const status = err.statusCode || 500;
    console.error(err);
  
    res.status(status).json({
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && err.details
        ? { details: err.details }
        : {}),
    });
  }
  