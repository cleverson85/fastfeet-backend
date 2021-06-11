import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.swagger();
  }

  middlewares() {
    this.server.use(cors({ origin: '*' }));
    this.server.use(morgan('dev'));

    const staticFolder = express.static(path.resolve(__dirname, '..', 'temp', 'uploads'));
    this.server.use('/files', staticFolder);
    this.server.use('/signature', staticFolder);

    this.server.use(express.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
    this.server.use(express.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' }));
  }

  routes() {
    this.server.use(routes);
  }

  swagger() {
    this.server.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }
}

export default new App().server;
