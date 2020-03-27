import * as Yup from 'yup';

import Order from '../models/Order';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Descrição para cancelamento deve ser informada.',
      });
    }

    const order = await Order.findAll({ where: { id: req.body.order_id, canceled_at: null } });

    if (!order) {
      return res.status(400).json({
        error: 'Pedido não encontrado.',
      });
    }

    return next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};
