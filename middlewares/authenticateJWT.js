// middlewares/authenticateJWT.js
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateJWT(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;  // attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
