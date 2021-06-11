import { Op } from 'sequelize';
import DeliveryMan from '../../models/DeliveryMan';
import Order from '../../models/Order';
import DeliveryManMethod from './Get';

class DeliveryManController {
  async store(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to post a Delivery Man.' */

    /*  #swagger.parameters['DeliveryMan'] = {
                in: 'body',
                description: 'Delivery Man information.',
                required: true,
                schema: { name: '', email: '' }
              } */

    const {
      name,
    } = await DeliveryMan.create(req.body);

    return res.send({ status: 200, message: `Entragador ${name} cadastrado com sucesso!` });
  }

  async update(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to update a Delivery Man.' */

    /*  #swagger.parameters['DeliveryMan'] = {
              in: 'body',
              description: 'Delivery Man information.',
              required: true,
              schema: { id: 0, name: '', email: '' }
            } */
    const { id } = req.body;
    const deliveryMan = await DeliveryMan.findByPk(id);

    if (!deliveryMan) {
      return res.send({ status: 401, message: `Entregador ${deliveryMan.name} não encontrado.` });
    }

    const {
      name,
    } = await deliveryMan.update(req.body);

    return res.send({ status: 200, message: `Entragador ${name} atualizado com sucesso!` });
  }

  async delete(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to delete a Delivery Man.' */

    /*  #swagger.parameters['id'] = {
        in: 'path',
        description: 'Delivery Man id',
        required: true } */

    const deliveryMan = await DeliveryManMethod.getById(req.params);

    if (!deliveryMan) {
      return res.send({ status: 401, message: `Entregador ${deliveryMan.name} não encontrado.` });
    }

    const order = await Order.findOne({
      where: {
        deliveryman_id: deliveryMan.id, canceled_at: null, start_date: { [Op.ne]: null },
      },
    });

    if (order) {
      return res.send({ status: 401, message: `Entregador  ${deliveryMan.name} possui entregas pendentes.` });
    }

    deliveryMan.destroy();
    return res.send({ status: 200, message: `Entregador ${deliveryMan.name} foi excluído com sucesso!` });
  }

  async index(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to get all Delivery Man.' */

    const deliveryMans = await DeliveryManMethod.getAll();
    return res.json(deliveryMans);
  }

  async findById(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to get a Delivery Man by id.' */

    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Delivery Man id',
            required: true } */

    const deliveryMan = await DeliveryManMethod.getById(req.params);
    return res.json(deliveryMan);
  }

  async findByName(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to get a Delivery Man by name.' */

    /*  #swagger.parameters['name'] = {
                in: 'path',
                description: 'Delivery Man name',
                required: true } */

    const deliveryMans = await DeliveryManMethod.getByName(req.params);
    return res.json(deliveryMans);
  }

  async deliveries(req, res) {
    /* #swagger.tags = ['Delivery Man']
       #swagger.description = 'Endpoint to get delivery by status.' */

    const deliveryMan = await DeliveryMan.findOne({ where: { id: req.params.id } });

    if (!deliveryMan) {
      return res.send({ status: 401, message: 'Usuário não encontrado.' });
    }

    const orders = await DeliveryManMethod.getByStatus(req.params);

    if (!orders) {
      return res.send({ status: 401, message: 'Não foram encotradas encomendas com entrega confirmada.' });
    }

    return res.json(orders);
  }
}

export default new DeliveryManController();
