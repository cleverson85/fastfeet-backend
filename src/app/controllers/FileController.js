import fs from 'fs';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
    const guid = uuidv4();

    const { data } = req.body;
    const name = `Encomenda_${guid}`;
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
  }
}

export default new FileController();
