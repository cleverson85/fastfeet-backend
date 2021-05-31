import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to post the specific recipient.' */
    try {
      const { numero, cep } = req.body;

      const recipient = await Recipient.findOne({
        where: { [Op.and]: [{ numero }, { cep }] },
      });

      if (recipient) {
        return res.send({ status: 401, message: 'Destinatário já cadastrado.' });
      }

      const {
        nome,
      } = await Recipient.create(req.body);

      return res.send({ status: 200, message: `Destinatário ${nome} cadastrado com sucesso!` });
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  }

  async update(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to update the specific recipient.' */
    try {
      const { cep } = req.body;

      const recipient = await Recipient.findOne({
        // where: { [Op.and]: [{ numero }, { cep }] },
        where: { cep },
      });

      if (!recipient) {
        return res.send({ status: 401, message: 'Destinatário não cadastrado.' });
      }

      const {
        nome,
      } = await recipient.update(req.body);

      return res.send({ status: 200, message: `Destinatário ${nome} editado com sucesso!` });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async index(req, res) {
    // const { name } = req.query;
    // const { id } = req.params;
    // let recipients = null;

    // if (name) {
    //   recipients = await Recipient.findAll({
    //     where: { nome: { [Op.iLike]: `%${name}%` } },
    //     order: ['id'],
    //   });
    // } else if (id) {
    //   recipients = await Recipient.findOne({
    //     where: { id },
    //     order: ['id'],
    //   });
    // } else {
    const recipients = await Recipient.findAll({
      order: ['id'],
    });
    // }

    return res.json(recipients);
  }

  async delete(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to delete the specific recipient.' */
    try {
      const { id } = req.params;

      const recipient = await Recipient.findOne({
        where: { id },
      });

      if (!recipient) {
        return res.send({ status: 401, message: 'Destinatário não cadastrado.' });
      }

      const order = await Order.findOne({
        where: {
          recipient_id: id, canceled_at: null, end_date: null,
        },
      });

      if (order) {
        return res.send({ status: 401, message: 'Destinatário possui entregas pendentes.' });
      }

      recipient.destroy();

      return res.send({ status: 200, message: `Destinatário ${recipient.nome} foi excluído com sucesso!` });
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  }
}

export default new RecipientController();
