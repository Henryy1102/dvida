import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Account() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      const { data } = await axios.put(
        `${API_BASE}/api/users/${user.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar usuario en store
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });

      setMessage("Datos actualizados correctamente");
      setEditing(false);
      setForm({ ...form, password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fondo">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <img src="/LOGO%20(2).jpeg" alt="d'vida" className="h-14 object-contain" />
          <h1 className="text-3xl font-bold text-primary">Mi Cuenta</h1>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded ${message.includes("Error") ? "bg-red-900/50 text-red-200 border border-red-600" : "bg-green-900/50 text-green-200 border border-green-600"}`}>
            {message}
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200">
        {!editing ? (
          <>
            <div className="space-y-4 mb-6">
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Nombre</p>
                <p className="text-lg font-semibold text-slate-900">{user?.nombre}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                <p className="text-lg font-semibold text-slate-900">{user?.telefono || "No registrado"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Rol</p>
                <p className="text-lg font-semibold text-slate-900 capitalize">{user?.rol}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Editar datos
              </button>
              {user?.rol === "cliente" && (
                <Link to="/facturas" className="btn-secondary">
                  Ver mis facturas
                </Link>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-slate-900 font-semibold mb-2">Nombre</label>
              <input
                type="text"
                className="input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-900 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-900 font-semibold mb-2">Teléfono</label>
              <input
                type="tel"
                className="input"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-slate-900 font-semibold mb-2">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setForm({
                    nombre: user?.nombre || "",
                    email: user?.email || "",
                    telefono: user?.telefono || "",
                    password: "",
                  });
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
};









