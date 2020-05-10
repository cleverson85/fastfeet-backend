import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    try {
      const {
        name,
      } = await DeliveryMan.create(req.body);

      return res.send({ status: 200, message: `Entragador ${name} cadastrado com sucesso!` });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async update(req, res) {
    try {
      const deliveryMan = await DeliveryMan.findOne({
        where: { email: req.body.email },
      });

      if (!deliveryMan) {
        return res.send({ status: 401, message: `Entregador ${deliveryMan.name} não encontrado.` });
      }

      const {
        name,
      } = await deliveryMan.update(req.body);

      return res.send({ status: 200, message: `Entragador ${name} atualizado com sucesso!` });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deliveryMan = await DeliveryMan.findOne({
        where: { id },
      });

      if (!deliveryMan) {
        return res.send({ status: 401, message: `Entregador ${deliveryMan.name} não encontrado.` });
      }

      const order = await Order.findOne({
        where: {
          deliveryman_id: id, canceled_at: null, start_date: { [Op.ne]: null },
        },
      });

      if (order) {
        return res.send({ status: 401, message: `Entregador  ${deliveryMan.name} possui entregas pendentes.` });
      }

      deliveryMan.destroy();

      return res.send({ status: 200, message: `Entregador ${deliveryMan.name} foi excluído com sucesso!` });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
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
      return res.send({ status: 401, message: e.message });
    }
  }

  async deliveries(req, res) {
    try {
      const deliveryMan = await DeliveryMan.findOne({ where: { id: req.params.id } });

      if (!deliveryMan) {
        return res.send({ status: 401, message: 'Usuário não encontrado.' });
      }

      const orders = await Order.findAll({
        where: {
          deliveryman_id: req.params.id,
          canceled_at: null,
        },
        attributes: ['product', 'start_date', 'end_date', 'created_at'],
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
        return res.send({ status: 401, message: 'Não foram encotradas encomendas com entrega confirmada.' });
      }

      return res.json(orders);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }
}

export default new DeliveryManController();
