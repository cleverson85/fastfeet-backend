import { Router } from 'express';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';

import authentication from './app/middlewares/autentication';
import validationRecipients from './app/middlewares/validationRecipients';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authentication);

routes.post('/recipients', validationRecipients, RecipientController.store);
routes.put('/recipients', validationRecipients, RecipientController.update);

export default routes;
