import Mail from '../../lib/Mail';

import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';

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

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Produto está disponível para a retirada',
        text: 'Você tem um produto disponível para retirada e entrega.',
      });

      return res.json({
        id,
        product,
        recipient_id,
        deliveryman_id,
        signature_id,
      });
    } catch (e) {
      return res.status(401).json(e.message);
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
      return res.status(401).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const order = await Order.findOne({
        where: { id: req.body.id, start_date: null, end_date: null },
      });

      if (!order) {
        return res.status(401).json({ error: 'Pedido não encontrado ou já entregue.' });
      }

      order.destroy();
      return res.status(200).json('Pedido excluído com sucesso!');
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }

  async index(req, res) {
    try {
      const orders = await Order.findAll({
        order: ['product'],
      });

      return res.json(orders);
    } catch (e) {
      return res.status(401).json(e.message);
    }
  }
}

export default new OrderController();
