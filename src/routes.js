import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import DeliveryManController from './app/controllers/DeliveryManController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryIssuesController from './app/controllers/DeliveryIssuesController';

import authentication from './app/middlewares/autentication';
import validationRecipient from './app/middlewares/validationRecipient';
import validationOrder from './app/middlewares/validationOrder';
import validationStartDelivery from './app/middlewares/validationStartDelivery';
import validationEndDelivery from './app/middlewares/validationEndDelivery';
import validationCancelDelivery from './app/middlewares/validationCancelDelivery';
import validationDeliveryMan from './app/middlewares/validationDeliveryMan';
import validationIssue from './app/middlewares/validationIssue';


const routes = new Router();
const upload = multer(multerConfig);

// ROTAS PARA LISTAR, INICIAR E FINALIZAR ENTREGA
routes.get('/delivery/:id', DeliveryController.index);
routes.put('/deliveryStart', validationStartDelivery, DeliveryController.startDelivery);
routes.put('/deliveryEnd', validationEndDelivery, DeliveryController.endDelivery);

// ROTA PARA LISTAR ENTREGAS POR ENTREGADOR
routes.get('/deliveryman/:id/deliveries', DeliveryManController.deliveries);

// ROTA PARA CADASTRO DE PROBLEMAS NA ENTREGA
routes.post('/deliveryissues', validationIssue, DeliveryIssuesController.issue);

// AUTENTICAÇÃO
routes.post('/session', SessionController.store);
routes.use(authentication);

// ROTAS PARA LISTAR PROBLEMAS NA ENTREGA
routes.get('/deliveryissues', DeliveryIssuesController.index);
routes.get('/deliveryissues/:orderid/issues', DeliveryIssuesController.issues);

// ROTAS PARA ADD, ATUALIZAR DESTINATÁRIO
routes.post('/recipient', validationRecipient, RecipientController.store);
routes.put('/recipient', validationRecipient, RecipientController.update);
routes.delete('/recipient/:id', RecipientController.delete);
routes.get('/recipient', RecipientController.index);
routes.get('/recipient/:id', RecipientController.index);

// ROTAS PARA ADD, ATUALIZAR, EXCLUIR E LISTAR ENTREGADORES
routes.post('/deliveryman', validationDeliveryMan, DeliveryManController.store);
routes.put('/deliveryman', validationDeliveryMan, DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);
routes.get('/deliveryman', DeliveryManController.index);
routes.get('/deliveryman/:id', DeliveryManController.index);

// ROTAS PARA ADD, ATUALIZAR, EXCLUIR E LISTAR PEDIDOS
routes.post('/order', validationOrder, OrderController.store);
routes.put('/order', validationOrder, OrderController.update);
routes.delete('/order', OrderController.delete);
routes.get('/order', OrderController.index);

// ROTAS PARA ARQUIVOS
routes.post('/files', upload.single('file'), FileController.store);

// ROTA PARA CANCELAMENTO DE PEDIDO
routes.put('/cancelDelivery/:id/cancel', validationCancelDelivery, DeliveryController.cancelDelivery);

export default routes;
