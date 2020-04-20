import Sequelize, { Model, DataTypes } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        canceled_at: DataTypes.DATEONLY,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.DeliveryMan, { foreignKey: 'deliveryman_id', as: 'deliveryMan' });
    this.belongsTo(models.Recipient, { foreignKey: 'recipient_id', as: 'recipient' });
    this.belongsTo(models.File, { foreignKey: 'signature_id', as: 'signature' });
  }
}

export default Order;
