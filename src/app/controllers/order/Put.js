import Order from '../../models/Order';

const updateOrder = async (param) => {
  const { id } = param;
  const order = await Order.findByPk(id);

  if (!order) {
    throw new { message: 'Pedido não encontrado.' }();
  }

  await order.update(param);
};

module.exports = {
  updateOrder,
};
