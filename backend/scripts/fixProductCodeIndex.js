import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/aguadevida';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
    const db = mongoose.connection.db;
    const coll = db.collection('products');

    const indexes = await coll.indexes();
    console.log('Índices actuales:', indexes.map(i => i.name));

    if (indexes.some(i => i.name === 'code_1')) {
      console.log('Eliminando índice code_1...');
      await coll.dropIndex('code_1');
      console.log('Índice code_1 eliminado.');
    } else {
      console.log('No existe índice code_1.');
    }

    console.log('Creando índice único parcial sobre `code` (solo cuando existe y no es null)...');
    await coll.createIndex(
      { code: 1 },
      { unique: true, partialFilterExpression: { code: { $exists: true, $ne: null } }, name: 'code_unique_partial' }
    );

    console.log('Índice `code_unique_partial` creado correctamente.');

    const newIndexes = await coll.indexes();
    console.log('Índices ahora:', newIndexes.map(i => i.name));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error al ajustar índices:', err);
    process.exit(1);
  }
}

run();
