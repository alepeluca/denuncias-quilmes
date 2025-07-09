import { promises as fs } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'comentarios.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const nuevoComentario = req.body;

    // Leer el archivo comentarios.json
    let data;
    try {
      data = await fs.readFile(FILE_PATH, 'utf8');
    } catch {
      data = '[]';
    }

    const comentarios = JSON.parse(data);
    nuevoComentario.fecha = new Date().toISOString();
    comentarios.push(nuevoComentario);

    // Guardar de nuevo
    await fs.writeFile(FILE_PATH, JSON.stringify(comentarios, null, 2));

    res.status(200).json({ message: 'Comentario agregado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando comentario' });
  }
}
