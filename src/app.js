import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());

    const staticFolder = express.static(path.resolve(__dirname, '..', 'temp', 'uploads'));
    this.server.use('/files', staticFolder);
    this.server.use('/signature', staticFolder);

    const jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
    const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' });
    this.server.use(jsonParser);
    this.server.use(urlencodedParser);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
