import formatISO from 'date-fns/formatISO';
import Order from '../../models/Order';
import CancelDeliveryAsync from './Cancel';
import GetAsync from './Get';

class DeliveryController {
  async index(req, res) {
    /* #swagger.tags = ['Delivery']
       #swagger.description = 'Endpoint to get all Deliveries.' */

    const orders = await GetAsync(req.params);

    if (!orders) {
      return res.send({ status: 401, message: 'Não foram encotradas encomendas.' });
    }

    return res.json(orders);
  }

  async startDelivery(req, res) {
    /* #swagger.tags = ['Delivery']
       #swagger.description = 'Endpoint to start a Delivery.' */

    const { id } = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.send({ status: 401, message: 'Não foram encotradas encomendas para entrega.' });
    }

    order.start_date = formatISO(new Date());
    await order.save();

    return res.send({ status: 200, message: 'Pedido retirado para entrega com sucesso.' });
  }

  async endDelivery(req, res) {
    /* #swagger.tags = ['Delivery']
       #swagger.description = 'Endpoint to end a Delivery.' */

    const { signature_id, id } = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.send({ status: 401, message: 'Não foram encotradas encomendas.' });
    }

    order.end_date = formatISO(new Date());
    order.signature_id = signature_id;
    await order.save();

    return res.json({ status: 200, message: 'Ok' });
  }

  async cancelDelivery(req, res) {
    /* #swagger.tags = ['Delivery']
       #swagger.description = 'Endpoint to cancel a Delivery.' */

    await CancelDeliveryAsync(req.params);
    return res.send({ status: 200, message: 'Pedido cancelado com sucesso.' });
  }
}

export default new DeliveryController();
