import formatISO from 'date-fns/formatISO';
import Mail from '../../../lib/Mail';
import DeliveryMan from '../../models/DeliveryMan';
import Order from '../../models/Order';

const cancelDelivery = async (params) => {
  const { id } = params;

  const order = await Order.findByPk(id);

  order.canceled_at = formatISO(new Date());
  await order.save();

  const deliveryman = await DeliveryMan.findByPk(order.deliveryman_id);

  await Mail.sendMail({
    to: `${deliveryman.name} <${deliveryman.email}>`,
    subject: `Pedido ${order.id} cancelado.`,
    text: `Informamos que o pedido de código ${order.id} foi cancelado.`,
  });
};

module.exports = {
  cancelDelivery,
};
