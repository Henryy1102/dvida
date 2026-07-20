import express from "express";
import {
  confirmarPago,
  rechazarPago,
  obtenerResumenPagos,
} from "../controllers/payment.controller.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Configuración (public para obtener, admin para actualizar)
router.get("/settings", getSettings);
router.put("/settings", auth, updateSettings); // Solo admin

// Pagos (admin only)
router.get("/resumen", auth, obtenerResumenPagos);
router.put("/:ordenId/confirmar", auth, confirmarPago);
router.put("/:ordenId/rechazar", auth, rechazarPago);

export default router;
