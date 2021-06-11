import Order from '../../models/Order';
import Recipient from '../../models/Recipient';
import DeliveryIssues from '../../models/DeliveryIssues';

class DeliveryIssuesController {
  getAtributtes() {
    return ['id', 'description', 'created_at'];
  }

  getIncludes() {
    return [
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
    ];
  }

  async index(req, res) {
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to get all Delivery Issues.' */
    try {
      const deliveryIssues = await DeliveryIssues.findAll({
        attributes: this.getAtributtes(),
        order: ['order_id'],
        include: this.getIncludes(),
      });

      return res.json(deliveryIssues);
    } catch (e) {
      return res.send({ status: 401, message: e.message });
    }
  }

  async issues(req, res) {
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to get a Delivery Issues by Order Id.' */

    const { orderid } = req.params;

    const issues = await DeliveryIssues.findAll({
      where: {
        order_id: orderid,
      },
      order: ['order_id'],
      attributes: this.getAtributtes(),
      include: this.getIncludes(),
    });

    if (!issues) {
      return res.send({ status: 401, message: 'Não foram encotrados registros para a pesquisa realizada.' });
    }

    return res.json(issues);
  }

  async issue(req, res) {
    /* #swagger.tags = ['Delivery Issues']
       #swagger.description = 'Endpoint to post Delivery Issues.' */
    const {
      order_id,
      description,
    } = await DeliveryIssues.create(req.body);

    return res.json({
      order_id, description,
    });
  }
}

export default new DeliveryIssuesController();
