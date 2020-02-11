import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    try {
      const { numero, cep } = req.body;

      const recipient = await Recipient.findOne({
        where: { [Op.and]: [{ numero }, { cep }] }
      });

      if (recipient) {
        return res.status(401).json({ error: 'Destinatário já cadastrado.' });
      }

      const {
        id,
        nome,
        rua,
        complemento,
        estado,
        cidade
      } = await Recipient.create(req.body);

      return res.json({ id, nome, rua, complemento, estado, cidade, cep });
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  update(req, res, next) {
    return res.json({ Ok: true });
  }
}

export default new RecipientController();