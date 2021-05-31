import { Op } from 'sequelize';
import * as Yup from 'yup';
import Order from '../models/Order';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    id: Yup.number().required(),
    signature_id: Yup.number().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.send({
      status: 401, message: 'Informações do pedido estão inválidas. Código do pedido e identificador de assinatura devem ser informados.',
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

  if (order) {
    return res.send({
      status: 401, message: 'Pedido já foi entregue.',
    });
  }

  return next();
};
