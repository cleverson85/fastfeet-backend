import Order from '../../models/Order';
import DeliveryIssues from '../../models/DeliveryIssues';

const deleteOrder = async (param) => {
  const { id } = param;

  const order = await Order.findOne({
    where: { id },
  });

  if (order && order.start_date && !order.canceled_at) {
    throw new { message: 'Não é possível excluir pedido retirado para entrega.' }();
  }

  const issues = await DeliveryIssues.findAll({
    where: {
      order_id: id,
    },
  });

  issues.forEach((element) => {
    element.destroy();
  });

  order.destroy();
};

module.exports = {
  deleteOrder,
};
