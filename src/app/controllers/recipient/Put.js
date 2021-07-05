import Recipient from '../../models/Recipient';

export default async function UpdateRecipient(param) {
  const { cep } = param;

  const recipient = await Recipient.findOne({
    where: { cep },
  });

  if (!recipient) {
    throw Error({ status: 401, message: 'Destinatário não cadastrado.' });
  }

  const { nome } = await recipient.update(param);

  return nome;
}
