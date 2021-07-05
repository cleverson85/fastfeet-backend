import { Op } from 'sequelize';
import DeliveryMan from '../../models/DeliveryMan';
import File from '../../models/File';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

const GetInclues = () => [{
  model: File,
  as: 'signature',
  attributes: ['id', 'path', 'url'],
},
{
  model: Recipient,
  as: 'recipient',
  attributes: ['nome', 'rua', 'numero', 'cidade', 'estado', 'cep'],
},
{
  model: DeliveryMan,
  as: 'deliveryMan',
  attributes: ['name'],
  include: [
    {
      model: File,
      as: 'avatar',
      attributes: ['id', 'path', 'url'],
    },
  ],
}];

const GetAtributes = () => ['id', 'product', 'signature_id', 'start_date', 'end_date', 'canceled_at'];

export async function GetAllAsync() {
  const orders = await Order.findAll({
    attributes: GetAtributes(),
    order: ['id'],
    include: GetInclues(),
  });

  return orders;
}

export async function GetByProductNameAsync(param) {
  const { productName } = param;

  const orders = await Order.findAll({
    where: { product: { [Op.iLike]: `%${productName}%` } },
    attributes: GetAtributes(),
    order: ['id'],
    include: GetInclues(),
  });

  return orders;
}

export async function GetByIdAsync(param) {
  const { id } = param;

  const orders = await Order.findOne({
    where: { id },
    attributes: GetAtributes(),
    order: ['id'],
    include: GetInclues(),
  });

  return orders;
}

export default [GetAllAsync, GetByProductNameAsync, GetByIdAsync];
