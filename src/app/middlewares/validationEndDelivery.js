import * as Yup from 'yup';
import { Op } from 'sequelize';

import Order from '../models/Order';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      signature_id: Yup.number().required(),
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.send({
        status: 401, message: `Informações do pedido estão inválidas. 
      Data de entrega, código do pedido e identificador de assinatura devem ser informados.`,
      });
    }

    let order = await Order.findByPk(req.body.id);

    if (!order) {
      return res.send({
        status: 401, message: 'Pedido não cadastrado.',
      });
    }

    order = await Order.findOne({
      where: { id: req.body.id, end_date: null, canceled_at: { [Op.ne]: null } },
    });

    if (!order) {
      return res.send({
        status: 401, message: 'Pedido já foi entregue.',
      });
    }

    return next();
  } catch (e) {
    return res.send({
      status: 401, message: e.message,
    });
  }
};
