import formatISO from 'date-fns/formatISO';

import Mail from '../../lib/Mail';
import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    try {
      const orders = await Order.findAll({
        where: { deliveryman_id: req.params.id, canceled_at: null, end_date: null },
        attributes: ['product'],
        order: ['product'],
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
        return res.send({ status: 401, message: 'Não foram encotradas encomendas para entrega.' });
      }

      return res.json(orders);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async startDelivery(req, res) {
    try {
      const order = await Order.findByPk(req.body.id);
      order.start_date = formatISO(new Date());

      await order.save();

      return res.send({ status: 200, message: 'Pedido retirado para entrega com sucesso.' });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async endDelivery(req, res) {
    try {
      const { signature_id, id } = req.body;

      const order = await Order.findByPk(id);
      order.end_date = formatISO(new Date());
      order.signature_id = signature_id;

      await order.save();

      return res.json({ status: 200, message: 'Ok' });
    } catch (e) {
      return res.send({ status: 401, message: 'Ocorreu um erro ao finalizar a entraga, entre em contato com a central' });
    }
  }

  async cancelDelivery(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);

      order.canceled_at = formatISO(new Date());
      await order.save();

      const deliveryman = await DeliveryMan.findByPk(order.deliveryman_id);

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: `Pedido ${order.id} cancelado.`,
        text: `Informamos que o pedido de código ${order.id} foi cancelado.`,
      });

      return res.send({ status: 200, message: 'Pedido cancelado com sucesso.' });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }
}

export default new DeliveryController();
