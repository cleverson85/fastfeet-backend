import formatISO from 'date-fns/formatISO';
import * as Yup from 'yup';
import Order from '../models/Order';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    id: Yup.number().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.send({ status: 401, message: 'Erro na validação.' });
  }

  const { id } = req.body;
  const hora = new Date().toLocaleDateString.getHours();

  console.log(hora);

  if (hora > 18 || hora < 8) {
    return res.send({ status: 401, message: 'Retirada para entrega somente pode ser efetuada entre às 8 e 18hs.' });
  }

  const order = await Order.findByPk(id);

  if (!order) {
    return res.send({ status: 401, message: 'Pedido não cadastrado.' });
  }

  const { deliveryman_id } = order;
  const parsedDate = formatISO(new Date());

  const count = await Order.findAll({
    where: { deliveryman_id, start_date: parsedDate, canceled_at: null },
  });

  if (count.length === 5) {
    return res.send({ status: 401, message: 'Entregador já atingiu o número máximo de pedidos para o dia.' });
  }

  return next();
};
