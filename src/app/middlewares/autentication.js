import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import auth from '../../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado.' });
  }

  const [, token] = authHeader.split(' ');

  const decoded = await promisify(jwt.verify)(token, auth.secret);
  req.userId = decoded.id;

  return next();
};
