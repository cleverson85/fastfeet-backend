import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    nome: Yup.string().required(),
    rua: Yup.string().required(),
    numero: Yup.number()
      .required(),
    estado: Yup.string().required(),
    cidade: Yup.string().required(),
    cep: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.send({ status: 401, message: 'Erro na validação. Todos os campos são obrigatórios.' });
  }

  return next();
};
