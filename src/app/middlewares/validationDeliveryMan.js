import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.send({ status: 401, message: 'Informações do entregador estão inválidas.' });
    }

    const { email, id } = req.body;
    const deliveryMan = await DeliveryMan.findOne({ where: { email } });

    if (deliveryMan && id === null) {
      return res.send({ status: 401, message: 'Email já cadastrado.' });
    }

    return next();
  } catch (e) {
    return res.send({ status: 401, message: e.message });
  }
};
