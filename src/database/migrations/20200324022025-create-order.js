module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Order', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recipient_id: {
      type: Sequelize.INTEGER,
      references: { model: 'recipient', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    deliveryman_id: {
      type: Sequelize.INTEGER,
      references: { model: 'deliveryman', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    signature_id: {
      type: Sequelize.INTEGER,
      references: { model: 'file', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('order'),
};
