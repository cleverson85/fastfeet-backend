import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryIssues from '../models/DeliveryIssues';

class DeliveryIssuesController {
  async index(req, res) {
    try {
      const deliveryIssues = await DeliveryIssues.findAll({
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

      return res.json(deliveryIssues);
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  async issues(req, res) {
    try {
      const issues = await DeliveryIssues.findAll({
        where: {
          order_id: req.params.order_id,
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
        return res.status(401).json({ error: 'Não foram encotrados registros para a pesquisa realizada.' });
      }

      return res.json(issues);
    } catch (e) {
      return res.status(401).json({ error: e.message });
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
      return res.status(401).json({ error: e.message });
    }
  }
}

export default new DeliveryIssuesController();
