import { Op } from 'sequelize';
import Queue from '../../lib/Queue';

import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import File from '../models/File';
import DeliveryIssues from '../models/DeliveryIssues';

class OrderController {
  async store(req, res) {
    try {
      const {
        id,
        product,
        recipient_id,
        deliveryman_id,
      } = await Order.create(req.body);

      const deliveryman = await DeliveryMan.findByPk(deliveryman_id);
      const recipient = await Recipient.findByPk(recipient_id);

      await Queue.add('Email', {
        id, product, deliveryman, recipient,
      });

      return res.send({ status: 200, message: 'Pedido cadastrado com secesso!' });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async update(req, res) {
    try {
      const order = await Order.findByPk(req.body.id);

      if (!order) {
        return res.send({ status: 401, message: 'Pedido não encontrado.' });
      }

      await order.update(req.body);

      return res.send({ status: 200, message: 'Pedido atualizado com secesso!' });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id },
      });

      if (order && order.start_date && !order.canceled_at) {
        return res.send({ status: 401, message: 'Não é possível excluir pedido retirado para entrega.' });
      }

      const issues = await DeliveryIssues.findAll({
        where: {
          order_id: id,
        },
      });

      issues.forEach((element) => {
        element.destroy();
      });

      order.destroy();
      return res.send({ status: 200, message: 'Pedido excluído com sucesso!' });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async index(req, res) {
    try {
      const { productName } = req.query;
      const { id } = req.params;
      let orders = null;

      if (id) {
        orders = await Order.findOne({
          where: { id },
          attributes: ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          include: [
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'nome', 'rua', 'numero', 'cidade', 'estado', 'cep'],
            },
            {
              model: DeliveryMan,
              as: 'deliveryMan',
              attributes: ['id', 'name'],
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
      } else if (!productName) {
        orders = await Order.findAll({
          attributes: ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          include: [
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['nome', 'rua', 'numero', 'cidade', 'estado', 'cep'],
            },
            {
              model: DeliveryMan,
              as: 'deliveryMan',
              attributes: ['name'],
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
      } else {
        orders = await Order.findAll({
          where: { product: { [Op.iLike]: `%${productName}%` } },
          attributes: ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          include: [
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['nome', 'rua', 'numero', 'cidade', 'estado', 'cep'],
            },
            {
              model: DeliveryMan,
              as: 'deliveryMan',
              attributes: ['name'],
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
      }

      return res.json(orders);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }
}

export default new OrderController();
