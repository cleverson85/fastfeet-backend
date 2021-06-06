import jwt from 'jsonwebtoken';
import auth from '../../config/authConfig';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    /* #swagger.tags = ['Session']
       #swagger.description = 'Endpoint to authentication.' */

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
  }
}

export default new SessionController();
