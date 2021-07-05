import DeliveryIssues from '../../models/DeliveryIssues';

export default async function DeleteOrderAsync(order) {
  const { id } = order;

  const issues = await DeliveryIssues.findAll({
    where: {
      order_id: id,
    },
  });

  issues.forEach((element) => {
    element.destroy();
  });

  order.destroy();
}
