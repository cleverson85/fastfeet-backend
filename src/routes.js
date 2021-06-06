import { Router } from 'express';
import multer from 'multer';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryIssuesController from './app/controllers/DeliveryIssuesController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/order/OrderController';
import RecipientController from './app/controllers/recipient/RecipientController';
import SessionController from './app/controllers/SessionController';
import errorHandler from './app/middlewares/errorHandler';
import validationCancelDelivery from './app/middlewares/validationCancelDelivery';
import validationDeliveryMan from './app/middlewares/validationDeliveryMan';
import validationEndDelivery from './app/middlewares/validationEndDelivery';
import validationIssue from './app/middlewares/validationIssue';
import validationOrder from './app/middlewares/validationOrder';
import validationRecipient from './app/middlewares/validationRecipient';
import validationStartDelivery from './app/middlewares/validationStartDelivery';
import multerConfig from './config/multer';

require('express-async-errors');

const router = new Router();
const upload = multer(multerConfig);

// ROTAS PARA LISTAR, INICIAR E FINALIZAR ENTREGA
router.get('/delivery/:id', DeliveryController.index);
router.put(
  '/deliveryStart',
  validationStartDelivery,
  DeliveryController.startDelivery,
);
router.put(
  '/deliveryEnd',
  validationEndDelivery,
  DeliveryController.endDelivery,
);

// ROTA PARA LISTAR ENTREGAS POR ENTREGADOR
router.get('/deliveryman/:id', DeliveryManController.index);
router.get(
  '/deliveryman/:id/deliveries?:status',
  DeliveryManController.deliveries,
);

// ROTA PARA CADASTRO DE PROBLEMAS NA ENTREGA
router.post('/deliveryissues', validationIssue, DeliveryIssuesController.issue);

// ROTAS PARA LISTAR PROBLEMAS NA ENTREGA POR PEDIDO
router.get('/deliveryissues/:orderid/issues', DeliveryIssuesController.issues);

// ROTA PARA UPLOAD DE ASSINATURA
router.post('/signature', FileController.storeSignature);

// AUTENTICAÇÃO
router.post('/session', SessionController.store);
// router.use(authentication);

// ROTAS PARA LISTAR PROBLEMAS NA ENTREGA
router.get('/deliveryissues', DeliveryIssuesController.index);

// ROTAS PARA ADD, ATUALIZAR DESTINATÁRIO
router.get('/recipient', RecipientController.index);
router.get('/recipient/:id', RecipientController.getById);
router.get('/recipient/:name', RecipientController.getByName);
router.post('/recipient', validationRecipient, RecipientController.store);
router.put('/recipient', validationRecipient, RecipientController.update);
router.delete('/recipient/:id', RecipientController.delete);

// ROTAS PARA ADD, ATUALIZAR, EXCLUIR E LISTAR ENTREGADORES
router.post('/deliveryman', validationDeliveryMan, DeliveryManController.store);
router.put('/deliveryman', validationDeliveryMan, DeliveryManController.update);
router.delete('/deliveryman/:id', DeliveryManController.delete);
router.get('/deliveryman', DeliveryManController.index);
router.get('/deliveryman/:id', DeliveryManController.index);

// ROTAS PARA ADD, ATUALIZAR, EXCLUIR E LISTAR PEDIDOS
router.post('/order', OrderController.store);
router.put('/order', validationOrder, OrderController.update);
router.delete('/order/:id', OrderController.delete);
router.get('/order/:id', OrderController.findById);
router.get('/order/:productName', OrderController.findByProductName);
router.get('/order', OrderController.index);

// ROTA PARA CANCELAMENTO DE PEDIDO
router.put(
  '/cancelDelivery/:id/cancel',
  validationCancelDelivery,
  DeliveryController.cancelDelivery,
);

// ROTAS PARA ARQUIVOS
router.post('/files', upload.single('file'), FileController.store);

// ERROR HANDLER
router.use(errorHandler);

export default router;
