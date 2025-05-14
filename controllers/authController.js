import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET_KEY;   

class AuthController {

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { User } = req.app.get('models');      

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error('Error logging in user:', err);
      next(err);                                   
    }
  };

    logout = (_req, res) => {
    // For JWTs, logout is handled client-side by discarding the token.
    res.status(200).json({ message: 'Logout successful' });
  };
}

export const authController = new AuthController();
