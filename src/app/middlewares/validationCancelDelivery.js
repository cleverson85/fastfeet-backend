import * as Yup from 'yup';
import { Op } from 'sequelize';

import Order from '../models/Order';
import DeliveryIssues from '../models/DeliveryIssues';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      cancel_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Data de cancelamento deve ser informada.',
      });
    }

    const issue = await DeliveryIssues.findByPk(req.params.id);

    if (!issue) {
      return res.send({ status: 401, message: 'Registro para cancelamento não encontrado.' });
    }

    let order = await Order.findOne({ where: { id: issue.order_id, canceled_at: null } });

    if (!order) {
      return res.send({ status: 401, message: 'Pedido já se encontra cancelado.' });
    }

    order = await Order.findOne({ where: { id: issue.order_id, end_date: { [Op.ne]: null } } });

    if (order) {
      return res.send({ status: 401, message: 'Pedido entregue. Não é possível efetuar o cancelamento.' });
    }

    return next();
  } catch (e) {
    return res.send({ status: 401, message: e.message });
  }
};
