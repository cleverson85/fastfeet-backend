import * as Yup from 'yup';

import Order from '../models/Order';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.send({
        status: 401, message: 'Descrição para cancelamento deve ser informada.',
      });
    }

    const order = await Order.findAll({ where: { id: req.body.order_id, canceled_at: null } });

    if (!order) {
      return res.send({
        status: 401, message: 'Pedido não encontrado.',
      });
    }

    return next();
  } catch (e) {
    return res.send({ status: 401, message: e.message });
  }
};
