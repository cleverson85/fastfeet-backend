import Mail from '../../lib/Mail';

import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';
import Recipient from '../models/Recipient';
import DeliveryIssues from '../models/DeliveryIssues';

class DeliveryController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const orders = await Order.findAll({
        where: { deliveryman_id: req.params.id, canceled_at: null, end_date: null },
        attributes: ['product'],
        order: ['product'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['nome', 'rua', 'numero', 'cidade', 'cep'],
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

      if (!orders) {
        return res.status(401).json({ error: 'Não foram encotradas encomendas para entrega.' });
      }

      return res.json(orders);
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async startDelivery(req, res) {
    try {
      const { start_date } = req.body;

      const order = await Order.findByPk(req.body.id);
      order.start_date = start_date;

      await order.save();

      return res.json(order);
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async endDelivery(req, res) {
    try {
      const { end_date, signature_id } = req.body;

      const order = await Order.findByPk(req.body.id);
      order.end_date = end_date;
      order.signature_id = signature_id;

      await order.save();

      return res.json(order);
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async cancelDelivery(req, res) {
    try {
      const { cancel_date } = req.body;

      const issue = await DeliveryIssues.findByPk(req.params.id);
      const order = await Order.findByPk(issue.order_id);

      order.canceled_at = cancel_date;
      await order.save();

      const deliveryman = await DeliveryMan.findByPk(order.deliveryman_id);

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: `Pedido ${order.id} cancelado.`,
        text: `Informamos que o pedido de código ${order.id} foi cancelado.`,
      });

      return res.json(order);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new DeliveryController();
