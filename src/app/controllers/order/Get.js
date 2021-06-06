import { Op } from 'sequelize';
import DeliveryMan from '../../models/DeliveryMan';
import File from '../../models/File';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

class OrderMethod {
  async getAll() {
    const orders = await Order.findAll({
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

    return orders;
  }

  async getByProductName(param) {
    const { productName } = param;

    const orders = await Order.findAll({
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

    return orders;
  }

  async getById(param) {
    const { id } = param;

    const orders = await Order.findOne({
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

    return orders;
  }
}

export default new OrderMethod();
