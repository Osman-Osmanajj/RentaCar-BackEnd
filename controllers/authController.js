// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';
import 'dotenv/config';

const {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY = process.env.JWT_SECRET_KEY
} = process.env;

class AuthController {
  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { User } = req.app.get('models');
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

      // create access & refresh tokens
      const accessToken = jwt.sign(
        { id: user.id, role: user.role, tenant_id: user.tenant_id },
        JWT_SECRET_KEY,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
      );

      
     res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: true,             
          sameSite: 'None',           
          maxAge: 15 * 60 * 1000
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure:   process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge:   7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(200)
        .json({
          message: 'Login successful',
          user: {
            id:        user.id,
            name:      user.name,
            email:     user.email,
            role:      user.role,
            tenant_id: user.tenant_id
          },
          accessToken
        });
    } catch (err) {
      next(err);
    }

  };

  // ─── LOGOUT ─────────────────────────────────────────────────────────────────
  logout = (_req, res) => {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ message: 'Logout successful' });
  };

  // ─── REFRESH ────────────────────────────────────────────────────────────────
  refresh = async (req, res) => {
    try {
      const token = req.cookies.refresh_token;
      if (!token) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }

      // verify and issue a new access token
      const payload = jwt.verify(token, JWT_REFRESH_SECRET_KEY);
      const newAccessToken = jwt.sign(
        { id: payload.id },
        JWT_SECRET_KEY,
        { expiresIn: '15m' }
      );

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   15 * 60 * 1000
      });
      return res.json({ message: 'Access token refreshed' });
    } catch (err) {
      console.error('Refresh token error:', err);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  };
}


// export const login = async (req, res, next) => {
//   try {
//       const { email, password } = req.body;
//       const { User } = req.app.get('models');
//       const user = await User.findOne({ where: { email } });
//       if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//       const valid = await bcrypt.compare(password, user.password);
//       if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//       // create access & refresh tokens
//       const accessToken = jwt.sign(
//         { id: user.id, role: user.role, tenant_id: user.tenant_id },
//         JWT_SECRET_KEY,
//         { expiresIn: '15m' }
//       );
//       const refreshToken = jwt.sign(
//         { id: user.id },
//         JWT_REFRESH_SECRET_KEY,
//         { expiresIn: '7d' }
//       );

//       // set them as HttpOnly, Secure, SameSite cookies
//       res
//         .cookie('access_token',  accessToken, {
//           httpOnly: true,
//           secure:   process.env.NODE_ENV === 'production',
//           sameSite: 'lax',
//           maxAge:   15 * 60 * 1000 // 15 minutes
//         })
//         .cookie('refresh_token', refreshToken, {
//           httpOnly: true,
//           secure:   process.env.NODE_ENV === 'production',
//           sameSite: 'lax',
//           maxAge:   7 * 24 * 60 * 60 * 1000 // 7 days
//         })
//         .status(200)
//         .json({
//           message: 'Login successful',
//           user: {
//             id:        user.id,
//             name:      user.name,
//             email:     user.email,
//             role:      user.role,
//             tenant_id: user.tenant_id
//           },
//           accessToken
//         });
//     } catch (err) {
//       next(err);
//     }
// }

export const authController = new AuthController();
