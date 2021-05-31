import deleteOrder from './Delete';
import OrderMethod from './Get';
import addOrder from './Post';
import updateOrder from './Put';

class OrderController {
  async store(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to post a order.' */

    /*  #swagger.parameters['Order'] = {
                in: 'body',
                description: 'Order information.',
                required: true,
                schema: { $ref: "#/definitions/addOrder" } } */

    addOrder(req.body);
    return res.send({ status: 200, message: 'Pedido cadastrado com secesso!' });
  }

  async update(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to update a order.' */

    /*  #swagger.parameters['Order'] = {
                in: 'body',
                description: 'Order information.',
                required: true,
                schema: { $ref: "#/definitions/updateOrder" } } */

    updateOrder(req.body);
    return res.send({ status: 200, message: 'Pedido atualizado com secesso!' });
  }

  async delete(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to delete a order.' */

    /*  #swagger.parameters['id'] = {
                in: 'params',
                description: '',
                required: true }
                schema: { $ref: "#/definitions/deleteOrder" } } */

    deleteOrder(req.params);
    return res.send({ status: 200, message: 'Pedido excluído com sucesso!' });
  }

  async findById(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    /*  #swagger.parameters['id'] = {
                in: 'path',
                description: '',
                required: true,
                schema: { $ref: "#/definitions/findById" } } */

    const orders = await OrderMethod.getById(req.params);
    return res.json(orders);
  }

  async findByProductName(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    /*  #swagger.parameters['productName'] = {
                in: 'path',
                description: '',
                required: true,
                schema: { $ref: "#/definitions/findByProductName" } } */

    const orders = await OrderMethod.getByProductName(req.params);
    return res.json(orders);
  }

  async index(req, res) {
    /* #swagger.tags = ['Order']
       #swagger.description = 'Endpoint to get all orders.' */

    const orders = await OrderMethod.getAll();
    return res.json({ message: 'aiaiaiaiai', order: orders });
  }
}

export default new OrderController();
