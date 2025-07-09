import { promises as fs } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'comentarios.json');

export default async function handler(req, res) {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    const comentarios = JSON.parse(data);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo leer comentarios' });
  }
}
