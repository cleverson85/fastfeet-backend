import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Informações do entregador estão inválidas.' });
    }

    const { email, id } = req.body;
    const deliveryMan = await DeliveryMan.findOne({ where: { email } });

    if (deliveryMan && id === null) {
      return res.status(401).json({ error: 'Email já cadastrado.' });
    }

    return next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};
