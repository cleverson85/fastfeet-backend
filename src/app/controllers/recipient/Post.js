import { Op } from 'sequelize';
import Recipient from '../../models/Recipient';

export default async function AddRecipient(param) {
  const { numero, cep } = param;

  const recipient = await Recipient.findOne({
    where: { [Op.and]: [{ numero }, { cep }] },
  });

  if (recipient) {
    throw Error({ status: 401, message: 'Destinatário já cadastrado.' });
  }

  const { nome } = await Recipient.create(param);

  return nome;
}
