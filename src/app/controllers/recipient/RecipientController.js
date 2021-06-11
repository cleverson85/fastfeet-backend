import deleteRecipient from './Delete';
import RecipientMethod from './Get';
import addRecipient from './Post';
import updateRecipient from './Put';

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

    const nome = addRecipient(req.body);
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

    const nome = updateRecipient(req.body);
    return res.send({ status: 200, message: `Destinatário ${nome} editado com sucesso!` });
  }

  async index(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get all recipients.' */

    const recipients = RecipientMethod.getAllRecipients();
    return res.json(recipients);
  }

  async getByName(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get a recipient by name.' */

    /*  #swagger.parameters['name'] = {
                in: 'path',
                description: 'Recipient name',
                required: true } */

    const recipients = RecipientMethod.getByName(req.params);
    return res.json(recipients);
  }

  async getById(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to get a specific recipient by id.' */

    const recipients = RecipientMethod.getById(req.params);
    return res.json(recipients);
  }

  async delete(req, res) {
    /* #swagger.tags = ['Recipient']
       #swagger.description = 'Endpoint to delete the specific recipient.' */

    const recipient = deleteRecipient(req.params);
    return res.send({ status: 200, message: `Destinatário ${recipient.nome} foi excluído com sucesso!` });
  }
}

export default new RecipientController();
