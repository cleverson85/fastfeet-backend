import { Op } from 'sequelize';

import Recipient from '../models/Recipient';
import Order from '../models/Order';

class RecipientController {
  async store(req, res) {
    try {
      const { numero, cep } = req.body;

      const recipient = await Recipient.findOne({
        where: { [Op.and]: [{ numero }, { cep }] },
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
        cidade,
      } = await Recipient.create(req.body);

      return res.json({
        id, nome, rua, complemento, estado, cidade, cep,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { numero, cep } = req.body;

      const recipient = await Recipient.findOne({
        where: { [Op.and]: [{ numero }, { cep }] },
      });

      if (!recipient) {
        return res.status(401).json({ error: 'Destinatário não cadastrado.' });
      }

      const {
        id,
        nome,
        rua,
        complemento,
        estado,
        cidade,
      } = await recipient.update(req.body);

      return res.json({
        id, nome, rua, complemento, estado, cidade, cep,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async index(req, res) {
    try {
      const { name, page = 1 } = req.query;
      const { id } = req.params;
      let recipients = null;

      if (name) {
        recipients = await Recipient.findAll({
          where: { nome: { [Op.iLike]: `%${name}%` } },
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
        });
      } else if (id) {
        recipients = await Recipient.findOne({
          where: { id },
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
        });
      } else {
        recipients = await Recipient.findAll({
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
        });
      }

      return res.json(recipients);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const recipient = await Recipient.findOne({
        where: { id },
      });

      if (!recipient) {
        return res.status(401).json({ error: 'Destinatário não cadastrado.' });
      }

      const order = await Order.findOne({
        where: {
          recipient_id: id, canceled_at: null, start_date: { [Op.ne]: null },
        },
      });

      if (order) {
        return res.status(400).send({ message: 'Destinatário possui entregas pendentes.' });
      }

      recipient.destroy();

      return res.status(200).send({ message: `Destinatário ${recipient.name} foi excluído com sucesso!` });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new RecipientController();
