import Mail from '../../lib/Mail';

export default {
  key: 'Email',
  async handle({ data }) {
    const { name, email } = data.deliveryman;
    const {
      nome, rua, numero, cep,
    } = data.recipient;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Pedido está disponível para a retirada',
      text:
`Você tem um produto disponível para retirada e entrega.
Cód.: ${data.id}
Nome.: ${data.product}
Destinatário: ${nome}
Endereço: Rua ${rua}, n°. ${numero} - CEP: ${cep}
Para maiores detalhes acesse a sua lista de pedidos.

Equipe FastFeet`,
    });
  },
};
