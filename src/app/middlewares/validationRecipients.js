import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    nome: Yup.string().required(),
    rua: Yup.string().required(),
    numero: Yup.number().required(),
    complemento: Yup.string().required(),
    estado: Yup.string().required(),
    cidade: Yup.string().required(),
    cep: Yup.number()
      .required()
      .max(8)
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Erro na validação.' });
  }

  return next();
};