import * as Yup from 'yup';
import { parseISO } from 'date-fns';

import Order from '../models/Order';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    id: Yup.number().required(),
    deliveryman_id: Yup.number().required(),
    start_date: Yup.date().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      error: `Informações do pedido estão inválidas. 
                Data de saída, código pedido e código do entregador devem ser informados.`,
    });
  }

  const hora = 10; // new Date().getHours();

  if (hora > 18 || hora < 8) {
    return res.status(401).json({ error: 'Retirada para entrega somente pode ser efetuada entre às 8 e 18hs.' });
  }

  const { id, deliveryman_id, start_date } = req.body;

  let order = await Order.findByPk(id);

  if (!order) {
    return res.status(401).json({ error: 'Pedido não cadastrado.' });
  }

  order = await Order.findOne({ where: { id, start_date: null } });

  if (!order) {
    return res.status(401).json({ error: 'Pedido está em rota de entrega.' });
  }

  const parsedDate = parseISO(start_date);
  const count = await Order.findAll({
    where: { deliveryman_id, start_date: parsedDate, canceled_at: null },
  });

  if (count.length === 5) {
    return res.status(401).json({ error: 'Entregador já atingiu o número máximo de pedidos para o dia.' });
  }

  return next();
};