// __tests__/middlewares/authenticateJWT.test.js
import { authenticateJWT } from '../../middlewares/authenticateJWT.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('authenticateJWT middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('responds 401 when no token is provided', () => {
    // no req.cookies.access_token
    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 401 when token is invalid/expired', () => {
    req.cookies.access_token = 'bad.token.here';
    // make jwt.verify throw
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    authenticateJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('bad.token.here', process.env.JWT_SECRET_KEY);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches payload to req.user and calls next on valid token', () => {
    req.cookies.access_token = 'good.token';
    const payload = { id: 123, role: 'User' };
    jwt.verify.mockReturnValue(payload);

    authenticateJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('good.token', process.env.JWT_SECRET_KEY);
    expect(req.user).toBe(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
