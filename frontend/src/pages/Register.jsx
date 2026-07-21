import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!nombre || !email || !identificacion || !fecha_nacimiento || !password || !confirmPassword) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    // Normalizar datos antes de enviar
    const normalizePhone = (tel) => (tel ? tel.replace(/\s+/g, '') : '');
    const normalizeDate = (dateStr) => {
      if (!dateStr) return '';
      // Si viene como dd/mm/yyyy -> convertir a yyyy-mm-dd
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
      }
      // Si viene en formato Date-like (yyyy-mm-dd) devolver tal cual
      return dateStr;
    };

    try {
      const payload = {
        nombre,
        email,
        identification: identificacion.trim(),
        telefono: normalizePhone(telefono),
        fecha_nacimiento: normalizeDate(fecha_nacimiento),
        password,
      };
      await register(payload);
      navigate("/catalog");
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };

  return (
    <div style={{background: '#ffffff', minHeight: '100vh'}} className="flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-300" style={{borderColor: '#d1d5db'}}>
        <div className="text-center mb-4 sm:mb-6">
          <img src="/LOGO%20(2).jpeg" alt="d'vida" className="h-16 sm:h-20 mx-auto mb-3 sm:mb-4 object-contain" />
          <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#000000'}}>Crear Cuenta</h2>
          <p className="text-xs sm:text-sm mt-2" style={{color: '#000000'}}>Únete a d'vida</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Nombre Completo *
            </label>
            <input
              type="text"
              className="input"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Email *
            </label>
            <input
              type="email"
              className="input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Teléfono
            </label>
            <input
              type="tel"
              className="input"
              placeholder="999 999 999"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Identificación *
            </label>
            <input
              type="text"
              className="input"
              placeholder="NIT o DUI"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Fecha de Nacimiento * (Debes ser mayor de 18 años)
            </label>
            <input
              type="date"
              className="input"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                tabIndex={-1}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block font-bold mb-2 text-sm sm:text-base" style={{color: '#000000'}}>
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input pr-10"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                tabIndex={-1}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <p className="text-center text-accent mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary hover:text-subtext font-semibold">
            Inicia sesión aquí
          </Link>
        </p>

        <footer className="text-center mt-6 pt-4 border-t border-primary/20">
          <p className="text-xs text-subtext">
            © 2026 d'vida – Todos los derechos reservados
          </p>
        </footer>
      </div>
    </div>
  );
}












