import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
  try {
    // Forzar resolvers públicos si la resolución local falla
    try {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
    } catch (e) {
      // No fatal: continuar con la resolución por defecto
      console.warn("No se pudieron establecer los DNS programáticamente:", e.message);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(" MongoDB conectado");
  } catch (error) {
    console.error(" Error MongoDB:", error.message);
    process.exit(1);
  }
};

export const fixProductIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) return;
    const coll = db.collection('products');
    const indexes = await coll.indexes();
    const names = indexes.map(i => i.name);
    console.log('Índices en products:', names);

    if (names.includes('code_1')) {
      console.log('Eliminando índice code_1 en products...');
      try {
        await coll.dropIndex('code_1');
        console.log('Índice code_1 eliminado');
      } catch (e) {
        console.warn('No se pudo eliminar index code_1:', e.message);
      }
    }

    // Crear un índice único parcial para evitar colisiones con valores nulos
    const partialName = 'code_unique_partial';
    if (!names.includes(partialName)) {
      console.log('Creando índice parcial único', partialName);
      try {
        // Usar $type para evitar problemas en versiones más antiguas que no soportan $ne en partialFilterExpression
        await coll.createIndex(
          { code: 1 },
          { unique: true, partialFilterExpression: { code: { $type: 'string' } }, name: partialName }
        );
        console.log('Índice parcial creado');
      } catch (e) {
        console.warn('No se pudo crear índice parcial:', e.message);
      }
    }
  } catch (err) {
    console.warn('Error al revisar/ajustar índices de products:', err.message || err);
  }
};
