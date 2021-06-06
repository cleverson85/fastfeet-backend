import { Op } from 'sequelize';
import Recipient from '../../models/Recipient';

const addRecipient = async (param) => {
  const { numero, cep } = param;

  const recipient = await Recipient.findOne({
    where: { [Op.and]: [{ numero }, { cep }] },
  });

  if (recipient) {
    throw Error({ status: 401, message: 'Destinatário já cadastrado.' });
  }

  const { nome } = await Recipient.create(param);

  return nome;
};

module.exports = {
  addRecipient,
};
