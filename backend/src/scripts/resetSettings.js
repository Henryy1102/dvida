import mongoose from "mongoose";
import Settings from "../models/Settings.js";
import dotenv from "dotenv";

dotenv.config();

const resetSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");

    // Eliminar todas las configuraciones existentes
    await Settings.deleteMany({});
    console.log("✓ Configuraciones anteriores eliminadas");

    // Crear nueva configuración
    const newSettings = await Settings.create({
      datosBancarios: {
        banco: "Banco del Pacifico",
        numeroCuenta: "1023187190",
        cedulaRuc: "0602914798",
        titular: "Garcia Dominguez Rene David",
        activo: true,
      },
      contacto: {
        telefonoDueño: "+593 98 924 5456",
        email: "aguadevida@gmail.com",
      },
      instrucciones: {
        efectivo: "El repartidor te cobrará al momento de la entrega",
        transferencia: "Incluye el número de orden en la referencia de tu transferencia",
        tiempoConfirmacion: "Se procesará cuando se confirme el pago",
      },
      nombreEmpresa: "d'vida",
    });

    console.log("✓ Nueva configuración creada correctamente");
    console.log(JSON.stringify(newSettings, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetSettings();
