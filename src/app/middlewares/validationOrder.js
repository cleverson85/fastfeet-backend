import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.send({ status: 401, message: 'Informações do pedido estão inválidas.' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryMan) {
      return res.send({ status: 401, message: 'Entregador não encontrado.' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.send({ status: 401, message: 'Destinatário não encontrado.' });
    }

    return next();
  } catch (e) {
    return res.send({ status: 401, message: e.message });
  }
};
