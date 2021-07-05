import { Op } from 'sequelize';
import DeliveryMan from '../../models/DeliveryMan';
import File from '../../models/File';
import Order from '../../models/Order';
import Recipient from '../../models/Recipient';

const GetInclues = () => [
  {
    model: File,
    as: 'avatar',
    attributes: ['id', 'path', 'url'],
  },
];

export const GetAll = async () => {
  const deliveryMans = await DeliveryMan.findAll({
    order: ['id'],
    include: GetInclues(),
  });

  return deliveryMans;
};

export async function GetByName(param) {
  const { name } = param;

  const deliveryMans = await DeliveryMan.findAll({
    where: { name: { [Op.iLike]: `%${name}%` } },
    order: ['id'],
    include: GetInclues(),
  });

  return deliveryMans;
}

export async function GetById(param) {
  const { id } = param;

  const deliveryMan = await DeliveryMan.findOne({
    where: { id },
    order: ['id'],
    include: GetInclues(),
  });

  return deliveryMan;
}

export async function GetByStatus(params) {
  const { status = 'P', id } = params;

  const orders = await Order.findAll({
    where: {
      deliveryman_id: id,
      end_date: (status === 'E' ? { [Op.ne]: null } : null),
      canceled_at: null,
    },
    attributes: ['id', 'product', 'start_date', 'end_date', 'created_at', 'canceled_at'],
    order: ['id'],
    include: [
      {
        model: Recipient,
        as: 'recipient',
        attributes: ['nome', 'rua', 'numero', 'cidade', 'cep', 'estado'],
      },
      {
        model: File,
        as: 'signature',
        attributes: ['id', 'path', 'url'],
      },
      {
        model: DeliveryMan,
        as: 'deliveryMan',
        attributes: ['id', 'name', 'email', 'created_at'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      },
    ],
  });

  return orders;
}

export default [GetAll, GetById, GetByStatus];
