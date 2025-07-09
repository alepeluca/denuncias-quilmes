import { promises as fs } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'comentarios.json');

export default async function handler(req, res) {
  // CORS para permitir llamadas desde otras URLs como GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitimos POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const nuevoComentario = req.body;

    // Leer archivo existente
    let data;
    try {
      data = await fs.readFile(FILE_PATH, 'utf8');
    } catch {
      data = '[]';
    }

    const comentarios = JSON.parse(data);
    nuevoComentario.fecha = new Date().toISOString();
    comentarios.push(nuevoComentario);

    // Guardar en el archivo
    await fs.writeFile(FILE_PATH, JSON.stringify(comentarios, null, 2));

    res.status(200).json({ message: 'Comentario agregado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando comentario' });
  }
}
