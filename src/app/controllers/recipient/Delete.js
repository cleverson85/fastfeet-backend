import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

const deleteRecipient = async (param) => {
  const { id } = param;

  const recipient = await Recipient.findOne({
    where: { id },
  });

  if (!recipient) {
    throw Error({ status: 401, message: 'Destinatário não cadastrado.' });
  }

  const order = await Order.findOne({
    where: {
      recipient_id: id, canceled_at: null, end_date: null,
    },
  });

  if (order) {
    throw Error({ status: 401, message: 'Destinatário possui entregas pendentes.' });
  }

  recipient.destroy();

  return recipient;
};

module.exports = {
  deleteRecipient,
};
