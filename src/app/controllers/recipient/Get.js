import { Op } from 'sequelize';
import Recipient from '../../models/Recipient';

class RecipientMethod {
  async getAllRecipients() {
    const recipients = await Recipient.findAll({
      order: ['id'],
    });

    return recipients;
  }

  async getByName(param) {
    const { name } = param;

    const recipients = await Recipient.findAll({
      where: { nome: { [Op.iLike]: `%${name}%` } },
      order: ['id'],
    });

    return recipients;
  }

  async getById(param) {
    const { id } = param;

    const recipients = await Recipient.findOne({
      where: { id },
      order: ['id'],
    });

    return recipients;
  }
}

export default new RecipientMethod();
