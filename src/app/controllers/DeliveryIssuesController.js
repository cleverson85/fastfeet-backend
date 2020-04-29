import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryIssues from '../models/DeliveryIssues';

class DeliveryIssuesController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const deliveryIssues = await DeliveryIssues.findAll({
        attributes: ['id', 'description'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'product'],
            include: [
              {
                model: Recipient,
                as: 'recipient',
                attributes: ['nome', 'rua', 'numero', 'cidade', 'cep'],
              },
            ],
          },
        ],
      });

      return res.json(deliveryIssues);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async issues(req, res) {
    try {
      const issues = await DeliveryIssues.findAll({
        where: {
          order_id: req.params.orderid,
        },
        attributes: ['id', 'description'],
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['product'],
            include: [
              {
                model: Recipient,
                as: 'recipient',
                attributes: ['nome', 'rua', 'numero', 'cidade', 'cep'],
              },
            ],
          },
        ],
      });

      if (!issues) {
        return res.send({ status: 401, message: 'Não foram encotrados registros para a pesquisa realizada.' });
      }

      return res.json(issues);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async issue(req, res) {
    try {
      const {
        order_id,
        description,
      } = await DeliveryIssues.create(req.body);

      return res.json({
        order_id, description,
      });
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }
}

export default new DeliveryIssuesController();
