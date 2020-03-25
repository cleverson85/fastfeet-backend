import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    try {
      const orders = await Order.findAll({
        where: { deliveryman_id: req.params.id, start_date: null, end_date: null },
        attributes: ['product'],
        order: ['product'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['nome', 'rua'],
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
}

export default new DeliveryController();
