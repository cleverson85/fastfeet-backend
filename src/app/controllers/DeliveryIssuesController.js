import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryIssues from '../models/DeliveryIssues';

class DeliveryIssuesController {
  async index(req, res) {
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to get all Delivery Issues.' */
    try {
      const deliveryIssues = await DeliveryIssues.findAll({
        attributes: ['id', 'description'],
        order: ['order_id'],
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'],
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
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to get a Delivery Issues by Order Id.' */
    try {
      const { orderid } = req.params;

      const issues = await DeliveryIssues.findAll({
        where: {
          order_id: orderid,
        },
        order: ['order_id'],
        attributes: ['id', 'description', 'created_at'],
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'],
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
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to post Delivery Issues.' */
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
