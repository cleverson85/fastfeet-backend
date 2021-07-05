import Order from '../../models/Order';

export default async function UpdateOrderAsync(param) {
  const { id } = param;
  const order = await Order.findByPk(id);

  if (!order) {
    throw Error({ message: 'Pedido não encontrado.' });
  }

  await order.update(param);
}
