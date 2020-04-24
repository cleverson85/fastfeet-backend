import { Op } from 'sequelize';
import Mail from '../../lib/Mail';

import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderController {
  async store(req, res) {
    try {
      const {
        id,
        product,
        recipient_id,
        deliveryman_id,
        signature_id,
      } = await Order.create(req.body);

      const deliveryman = await DeliveryMan.findByPk(deliveryman_id);
      const recipient = await Recipient.findByPk(recipient_id);

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Pedido está disponível para a retirada',
        text: `Você tem um produto disponível para retirada e entrega.
               Cód.: ${id}
               Nome.: ${product} 
               Destinatário: ${recipient.nome}
               Endereço: Rua ${recipient.rua}, N°. ${recipient.numero} - CEP: ${recipient.cep}
               Para maiores detalhes acesse a sua lista de pedidos.
               
               Equipe FastFeet`,
      });

      return res.json({
        id,
        product,
        recipient_id,
        deliveryman_id,
        signature_id,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const order = await Order.findByPk(req.body.id);

      if (!order) {
        return res.status(401).json({ error: 'Pedido não cadastrado.' });
      }

      const {
        id,
        product,
        recipient_id,
        deliveryman_id,
      } = await order.update(req.body);

      return res.json({
        id,
        product,
        recipient_id,
        deliveryman_id,
      });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id, start_date: null, end_date: null },
      });

      if (!order) {
        return res.status(401).json({ error: 'Pedido não encontrado ou já entregue.' });
      }

      order.destroy();
      return res.status(200).json('Pedido excluído com sucesso!');
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async index(req, res) {
    try {
      const { productName, page = 1 } = req.query;
      const { id } = req.params;
      let orders = null;

      if (id) {
        orders = await Order.findOne({
          where: { id },
          attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'nome'],
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
          attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
          include: [
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
          attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
          order: ['id'],
          limit: 10,
          offset: (page - 1) * 10,
          include: [
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
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new OrderController();
