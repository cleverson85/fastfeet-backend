import jwt from 'jsonwebtoken';

import User from '../models/User';
import auth from '../../config/authConfig';

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      const userExists = await User.findOne({
        where: { email }
      });

      if (!userExists) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      if (!(await userExists.checkPassword(password))) {
        return res.status(401).json({ error: 'Senha inválida.' });
      }

      const { id, name } = userExists;

      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, auth.secret, {
          expiresIn: auth.expiresIn
        })
      });
    } catch (Error) {
      return res.json(Error.message);
    }
  }
}

export default new SessionController();
