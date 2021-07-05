import Queue from '../../../lib/Queue';
import DeliveryMan from '../../models/DeliveryMan';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

async function SendEmail({
  id,
  product,
  recipient_id,
  deliveryman_id,
}) {
  const deliveryman = await DeliveryMan.findByPk(deliveryman_id);
  const recipient = await Recipient.findByPk(recipient_id);

  await Queue.add('Email', {
    id, product, deliveryman, recipient,
  });
}

export default async function AddOrderAsync(param) {
  const {
    id,
    product,
    recipient_id,
    deliveryman_id,
  } = await Order.create(param);

  await SendEmail({
    id,
    product,
    recipient_id,
    deliveryman_id,
  });

  return id;
}
