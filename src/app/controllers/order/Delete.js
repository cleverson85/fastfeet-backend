import DeliveryIssues from '../../models/DeliveryIssues';

const deleteOrder = async (order) => {
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
};

module.exports = {
  deleteOrder,
};
