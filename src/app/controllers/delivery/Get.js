import DeliveryMan from '../../models/DeliveryMan';
import File from '../../models/File';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

class DeliveryMethod {
  async get(params) {
    const { id } = params;

    const orders = await Order.findAll({
      where: { deliveryman_id: id, canceled_at: null, end_date: null },
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

    return orders;
  }
}

export default new DeliveryMethod();
