import DeleteOrderAsync from './Delete';
import { GetAllAsync, GetByProductNameAsync, GetByIdAsync } from './Get';
import AddOrderAsync from './Post';
import UpdateOrderAsync from './Put';

class OrderController {
  async store(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to post a order.' */

    /*  #swagger.parameters['Order'] = {
                in: 'body',
                description: 'Order information.',
                required: true,
                type: 'object',
                schema: { product: '', recipient_id: 0, deliveryman_id: 0 }
              } */

    await AddOrderAsync(req.body);
    return res.send({ status: 200, message: 'Pedido cadastrado com secesso!' });
  }

  async update(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to update a order.' */

    /*  #swagger.parameters['Order'] = {
                in: 'body',
                description: 'Order information.',
                required: true,
                type: 'object',
                schema: { id: 0, product: '', recipient_id: 0, deliveryman_id: 0 }
              } */

    await UpdateOrderAsync(req.body);
    return res.send({ status: 200, message: 'Pedido atualizado com secesso!' });
  }

  async delete(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to delete a order.' */

    /*  #swagger.parameters['id'] = {
                in: 'params',
                description: 'Order id',
                required: true } } */

    const order = await GetByIdAsync(req.params);

    if (order && order.start_date && !order.canceled_at) {
      return res.send({ status: 404, message: 'Não é possível excluir pedido retirado para entrega.' });
    }

    await DeleteOrderAsync(order);

    return res.send({ status: 200, message: 'Pedido excluído com sucesso!' });
  }

  async findById(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Order id',
                required: true } */

    const orders = await GetByIdAsync(req.params);
    return res.json(orders);
  }

  async findByProductName(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    /*  #swagger.parameters['productName'] = {
                in: 'path',
                description: 'Product name',
                required: true } */

    const orders = await GetByProductNameAsync(req.params);
    return res.json(orders);
  }

  async index(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    const orders = await GetAllAsync();
    return res.json(orders);
  }
}

export default new OrderController();
