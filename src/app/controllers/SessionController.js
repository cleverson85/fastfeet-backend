import jwt from 'jsonwebtoken';

import User from '../models/User';
import auth from '../../config/authConfig';

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });

      if (!userExists) {
        return res.send({ status: 401, message: 'Usuário não encontrado.' });
      }

      if (!(await userExists.checkPassword(password))) {
        return res.send({ status: 401, message: 'Usuário ou senha inválidos.' });
      }

      const { id, name } = userExists;

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, auth.secret, {
          expiresIn: auth.expiresIn,
        }),
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new SessionController();
