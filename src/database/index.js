import Sequelize from 'sequelize';
import DeliveryIssues from '../app/models/DeliveryIssues';
import DeliveryMan from '../app/models/DeliveryMan';
import File from '../app/models/File';
import Order from '../app/models/Order';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [DeliveryMan, File, Order, Recipient, User, DeliveryIssues];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach((model) => model.init(this.connection));
    models.forEach((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
