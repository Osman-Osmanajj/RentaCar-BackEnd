// __tests__/controllers/authController.test.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authController } from '../../controllers/authController.js';

describe('AuthController', () => {
  let req;
  let res;
  let next;
  let findOneMock;

  beforeEach(() => {
    // stub Sequelize lookup
    findOneMock = jest.fn();
    req = {
      body: {},
      cookies: {},
      app: { get: () => ({ User: { findOne: findOneMock } }) }
    };

    // stub Express response methods
    res = {
      status:      jest.fn().mockReturnThis(),
      cookie:      jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      json:        jest.fn().mockReturnThis()
    };

    next = jest.fn();

    // reset our “mocks” on the real modules
    bcrypt.compare = jest.fn();
    jwt.sign      = jest.fn();
    jwt.verify    = jest.fn();
  });

  describe('login', () => {
    it('returns 401 if user not found', async () => {
      findOneMock.mockResolvedValue(null);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('returns 401 if password invalid', async () => {
      findOneMock.mockResolvedValue({ password: 'hashed', id: 1, role: 'user', tenant_id: 1 });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('sets cookies & returns user + accessToken on success', async () => {
      const fakeUser = {
        id:        5,
        name:      'Alice',
        email:     'alice@example.com',
        password:  'hashed',
        role:      'admin',
        tenant_id: 42
      };
      findOneMock.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign
        .mockReturnValueOnce('accessToken123')
        .mockReturnValueOnce('refreshTokenABC');

      req.body = { email: fakeUser.email, password: 'plain' };
      await authController.login(req, res, next);

      // 1st cookie = access_token
      expect(res.cookie).toHaveBeenNthCalledWith(
        1,
        'access_token',
        'accessToken123',
        expect.objectContaining({
          httpOnly: true,
          secure:   true,
          sameSite: 'None',
          maxAge:   30 * 24 * 60 * 60 * 1000
        })
      );
      // 2nd cookie = refresh_token
      expect(res.cookie).toHaveBeenNthCalledWith(
        2,
        'refresh_token',
        'refreshTokenABC',
        expect.objectContaining({
          httpOnly: true,
          secure:   false,        // NODE_ENV !== 'production'
          sameSite: 'None',
          maxAge:   7 * 24 * 60 * 60 * 1000
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id:        fakeUser.id,
          name:      fakeUser.name,
          email:     fakeUser.email,
          role:      fakeUser.role,
          tenant_id: fakeUser.tenant_id
        },
        accessToken: 'accessToken123'
      });
    });
  });

  describe('logout', () => {
    it('clears cookies and returns logout message', () => {
      authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });
  });

  describe('refresh', () => {
    it('401 when no refresh token provided', async () => {
      req.cookies = {}; // no token

      await authController.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No refresh token provided' });
    });

    it('401 when token is invalid', async () => {
      req.cookies = { refresh_token: 'badToken' };
      jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

      await authController.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid refresh token' });
    });

    it('sets new access token cookie on valid refresh', async () => {
      req.cookies = { refresh_token: 'goodToken' };
      jwt.verify.mockReturnValue({ id: 77 });
      jwt.sign.mockReturnValue('newAccessTokenXYZ');

      await authController.refresh(req, res);

      expect(jwt.verify).toHaveBeenCalledWith('goodToken', expect.any(String));
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'newAccessTokenXYZ',
        expect.objectContaining({
          httpOnly: true,
          secure:   false,
          sameSite: 'lax',
          maxAge:   15 * 60 * 1000
        })
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Access token refreshed' });
    });
  });
});
