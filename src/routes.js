import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import DeliveryManController from './app/controllers/DeliveryManController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';

import authentication from './app/middlewares/autentication';
import validationRecipient from './app/middlewares/validationRecipient';
import validationOrder from './app/middlewares/validationOrder';
import validationStartDelivery from './app/middlewares/validationStartDelivery';
import validationEndDelivery from './app/middlewares/validationEndDelivery';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/delivery/:id', DeliveryController.index);
routes.put('/deliveryStart', validationStartDelivery, DeliveryController.startDelivery);
routes.put('/deliveryEnd', validationEndDelivery, DeliveryController.endDelivery);

routes.get('/deliveryman/:id/deliveries', DeliveryManController.deliveries);

routes.post('/session', SessionController.store);
routes.use(authentication);

routes.post('/recipients', validationRecipient, RecipientController.store);
routes.put('/recipients', validationRecipient, RecipientController.update);

routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman', DeliveryManController.update);
routes.delete('/deliveryman', DeliveryManController.delete);
routes.get('/deliveryman', DeliveryManController.index);

routes.post('/order', validationOrder, OrderController.store);
routes.put('/order', validationOrder, OrderController.update);
routes.delete('/order', OrderController.delete);
routes.get('/order', OrderController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
