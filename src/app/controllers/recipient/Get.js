import { Op } from 'sequelize';
import Recipient from '../../models/Recipient';

export async function GetAllRecipients() {
  const recipients = await Recipient.findAll({
    order: ['id'],
  });

  return recipients;
}

export async function GetByName(param) {
  const { name } = param;

  const recipients = await Recipient.findAll({
    where: { nome: { [Op.iLike]: `%${name}%` } },
    order: ['id'],
  });

  return recipients;
}

export async function GetById(param) {
  const { id } = param;

  const recipients = await Recipient.findOne({
    where: { id },
    order: ['id'],
  });

  return recipients;
}

export default [GetAllRecipients, GetByName, GetById];
