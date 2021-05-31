import Queue from '../../../lib/Queue';
import DeliveryMan from '../../models/DeliveryMan';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

const sendEmail = async ({
  id,
  product,
  recipient_id,
  deliveryman_id,
}) => {
  const deliveryman = await DeliveryMan.findByPk(deliveryman_id);
  const recipient = await Recipient.findByPk(recipient_id);

  await Queue.add('Email', {
    id, product, deliveryman, recipient,
  });
};

const addOrder = async (param) => {
  const {
    id,
    product,
    recipient_id,
    deliveryman_id,
  } = await Order.create(param);

  sendEmail({
    id,
    product,
    recipient_id,
    deliveryman_id,
  });

  return id;
};

module.exports = {
  addOrder,
};
