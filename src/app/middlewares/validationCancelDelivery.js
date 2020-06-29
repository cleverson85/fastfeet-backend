import { Op } from 'sequelize';

import Order from '../models/Order';

export default async (req, res, next) => {
  try {
    let order = await Order.findOne({ where: { id: req.params.id, canceled_at: null } });

    if (!order) {
      return res.send({ status: 401, message: 'Pedido já se encontra cancelado.' });
    }

    order = await Order.findOne({ where: { id: req.params.id, end_date: { [Op.ne]: null } } });

    if (order) {
      return res.send({ status: 401, message: 'Pedido entregue. Não é possível efetuar o cancelamento.' });
    }

    return next();
  } catch (e) {
    return res.send({ status: 401, message: e.message });
  }
};
