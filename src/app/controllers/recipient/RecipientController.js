import DeleteRecipient from './Delete';
import { GetAllRecipients, GetByName, GetById } from './Get';
import AddRecipient from './Post';
import UpdateRecipient from './Put';

class RecipientController {
  async store(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to post the specific recipient.' */

    /*  #swagger.parameters['Recipient'] = {
                in: 'body',
                description: 'Recipient information.',
                required: true,
                type: 'object',
                schema: { nome: '',
                          rua: '',
                          numero: 0,
                          complemento: '',
                          estado: '',
                          cidade: '',
                          cep: '' }
              } */

    const nome = await AddRecipient(req.body);
    return res.send({ status: 200, message: `Destinatário ${nome} cadastrado com sucesso!` });
  }

  async update(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to update the specific recipient.' */

    /*  #swagger.parameters['Recipient'] = {
            in: 'body',
            description: 'Recipient information.',
            required: true,
            type: 'object',
            schema: { id: 0,
                      nome: '',
                      rua: '',
                      numero: 0,
                      complemento: '',
                      estado: '',
                      cidade: '',
                      cep: '' }
          } */

    const nome = await UpdateRecipient(req.body);
    return res.send({ status: 200, message: `Destinatário ${nome} editado com sucesso!` });
  }

  async index(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get all recipients.' */

    const recipients = await GetAllRecipients();
    return res.json(recipients);
  }

  async getByName(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get a recipient by name.' */

    /*  #swagger.parameters['name'] = {
                in: 'path',
                description: 'Recipient name',
                required: true } */

    const recipients = await GetByName(req.params);
    return res.json(recipients);
  }

  async getById(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get a specific recipient by id.' */

    const recipients = await GetById(req.params);
    return res.json(recipients);
  }

  async delete(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to delete the specific recipient.' */

    const recipient = await DeleteRecipient(req.params);
    return res.send({ status: 200, message: `Destinatário ${recipient.nome} foi excluído com sucesso!` });
  }
}

export default new RecipientController();
