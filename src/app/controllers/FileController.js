import fs from 'fs';
import { resolve } from 'path';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async storeSignature(req, res) {
    try {
      const { data, id } = req.body;
      const name = `Encomenda_${id}`;
      const path = resolve(__dirname, '..', '..', '..', 'temp', 'uploads');
      const destination = `${path}/${name}.jpeg`;
      const base64Data = data.replace(/^data:image\/png;base64,/, '');

      fs.writeFileSync(destination, base64Data, 'base64', (err) => res.json({
        status: 401, message: err.message,
      }));

      const fileData = { name, path: `${name}.jpeg` };
      let file = await File.findOne({ where: { name } });

      if (file) {
        await file.update(fileData);
      } else {
        file = await File.create(fileData);
      }

      return res.json(file);
    } catch (e) {
      return res.status().send({ status: 401, message: 'Ocorreu um erro, entre em contato com a central.' });
    }
  }
}

export default new FileController();
