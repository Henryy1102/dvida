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
