import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    try {
      const {
        id,
        name,
        email,
        avatar_id,
      } = await DeliveryMan.create(req.body);

      return res.json({
        id, name, email, avatar_id,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const deliveryMan = await DeliveryMan.findOne({
        where: { email: req.body.email },
      });

      if (!deliveryMan) {
        return res.status(401).json({ error: 'Entregador não cadastrado.' });
      }

      const {
        name, email, avatar_id,
      } = await deliveryMan.update(req.body);

      return res.json({
        name, email, avatar_id,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deliveryMan = await DeliveryMan.findOne({
        where: { id },
      });

      if (!deliveryMan) {
        return res.status(401).json({ error: 'Entregador não cadastrado.' });
      }

      const order = await Order.findOne({
        where: {
          deliveryman_id: id, canceled_at: null, start_date: { [Op.ne]: null },
        },
      });

      if (order) {
        return res.status(400).send({ message: 'Entregador possui entregas pendentes.' });
      }

      deliveryMan.destroy();

      return res.status(200).send({ message: `Entregador ${deliveryMan.name} foi excluído com sucesso!` });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async index(req, res) {
    try {
      const { name, page = 1 } = req.query;
      const { id } = req.params;

      let deliveryMans = null;

      if (id) {
        deliveryMans = await DeliveryMan.findOne({
          where: { id },
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        });
      } else if (name) {
        deliveryMans = await DeliveryMan.findAll({
          where: { name: { [Op.iLike]: `%${name}%` } },
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        });
      } else {
        deliveryMans = await DeliveryMan.findAll({
          order: ['id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        });
      }

      return res.json(deliveryMans);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async deliveries(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          deliveryman_id: req.params.id,
          start_date: { [Op.ne]: null },
          end_date: { [Op.ne]: null },
          canceled_at: null,
        },
        attributes: ['product'],
        order: ['product'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['nome', 'rua', 'numero', 'cidade', 'cep'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'path', 'url'],
          },
          {
            model: DeliveryMan,
            as: 'deliveryMan',
            attributes: ['name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
        ],
      });

      if (!orders) {
        return res.status(401).json({ error: 'Não foram encotradas encomendas entregues.' });
      }

      return res.json(orders);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new DeliveryManController();
