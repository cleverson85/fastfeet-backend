import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    try {
      const deliveryMan = await DeliveryMan.findOne({
        where: { email: req.body.email },
      });

      if (deliveryMan) {
        return res.status(401).json({ error: 'Entregador já cadastrado.' });
      }

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
      return res.status(401).json(e.message);
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
        id, name, email,
      } = await deliveryMan.update(req.body);

      return res.json({
        id, name, email,
      });
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const deliveryMan = await DeliveryMan.findOne({
        where: { email: req.body.email },
      });

      if (!deliveryMan) {
        return res.status(401).json({ error: 'Entregador não cadastrado.' });
      }

      const order = await Order.findOne({
        where: {
          deliveryman_id: deliveryMan.Id, canceled_at: null,
        },
      });

      if (order) {
        return res.status(401).json({ error: 'Entregador entregas pendentes.' });
      }

      deliveryMan.destroy().then((rowDeleted) => {
        if (rowDeleted === 1) {
          res.status(200).json(`Entregador ${deliveryMan.name} foi excluído com sucesso!`);
        }
      });

      return res.status(401).json({ error: 'Não foi possível executar a operação.' });
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async index(req, res) {
    try {
      const deliveryMans = await DeliveryMan.findAll({
        order: ['name'],
      });

      return res.json(deliveryMans);
    } catch (e) {
      return res.status(401).json(e.message);
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
      return res.status(401).json(e.message);
    }
  }
}

export default new DeliveryManController();
