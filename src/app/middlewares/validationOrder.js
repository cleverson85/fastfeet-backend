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
      return res.status(400).json({ error: 'Informações do pedido estão inválidas.' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Entregador não encontrado.' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    return next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};
