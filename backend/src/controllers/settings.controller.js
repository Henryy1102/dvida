import Settings from "../models/Settings.js";

// Obtener configuración
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Crear configuración por defecto si no existe
      settings = await Settings.create({
        datosBancarios: {
          banco: "Banco del Pacifico",
          numeroCuenta: "1023187190 ",
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
    }

    res.json(settings);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
};

// Actualizar configuración
export const updateSettings = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para actualizar la configuración" });
    }

    const {
      datosBancarios,
      contacto,
      instrucciones,
      nombreEmpresa,
      horarioAtencion,
      diasEntrega,
      tiempoEntregaEstimado,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Actualizar campos
    if (datosBancarios) settings.datosBancarios = datosBancarios;
    if (contacto) settings.contacto = contacto;
    if (instrucciones) settings.instrucciones = instrucciones;
    if (nombreEmpresa) settings.nombreEmpresa = nombreEmpresa;
    if (horarioAtencion) settings.horarioAtencion = horarioAtencion;
    if (diasEntrega) settings.diasEntrega = diasEntrega;
    if (tiempoEntregaEstimado) settings.tiempoEntregaEstimado = tiempoEntregaEstimado;

    await settings.save();

    res.json({
      mensaje: "Configuración actualizada correctamente",
      settings,
    });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
};

