import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminReportes() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reportes, setReportes] = useState(null);
  const [inventario, setInventario] = useState(null);
  const [clientesFrecuentes, setClientesFrecuentes] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [pestaña, setPestaña] = useState("resumen");

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
      return;
    }
    cargarTodosLosReportes();
  }, [user, navigate]);

  const cargarTodosLosReportes = async () => {
    setCargando(true);
    try {
      await Promise.all([
        cargarReportesVentas(),
        cargarInventario(),
        cargarClientesFrecuentes(),
        cargarTendencias(),
      ]);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarReportesVentas = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const response = await fetch(
        `${API_BASE}/api/reports/ventas?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setReportes(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cargarInventario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/reports/inventario`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setInventario(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cargarClientesFrecuentes = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limite: 10 });
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const response = await fetch(
        `${API_BASE}/api/reports/clientes-frecuentes?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setClientesFrecuentes(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cargarTendencias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/reports/tendencias`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setTendencias(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBuscar = () => {
    cargarReportesVentas();
    cargarClientesFrecuentes();
  };

  const handleLimpiar = () => {
    setFechaInicio("");
    setFechaFin("");
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-fondo flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-accent">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  // Datos para gráfico de ventas por mes
  const ventasPorMesData = {
    labels: reportes?.gananciasPorMes?.map((g) => g.mes) || [],
    datasets: [
      {
        label: "Ventas ($)",
        data: reportes?.gananciasPorMes?.map((g) => g.total) || [],
        borderColor: "#FF4D8D",
        backgroundColor: "rgba(255, 77, 141, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfico de productos más vendidos
  const topProductosData = {
    labels: reportes?.topProductos?.map((p) => p.nombre) || [],
    datasets: [
      {
        label: "Cantidad Vendida",
        data: reportes?.topProductos?.map((p) => p.cantidad) || [],
        backgroundColor: [
          "#FF4D8D",
          "#00E5FF",
          "#FFD60A",
          "#B5179E",
          "#FF006E",
        ],
      },
    ],
  };

  // Datos para gráfico de métodos de pago
  const metodosPagoData = {
    labels: reportes?.metodosPago?.map((m) => m.metodo.toUpperCase()) || [],
    datasets: [
      {
        data: reportes?.metodosPago?.map((m) => m.total) || [],
        backgroundColor: ["#FF4D8D", "#00E5FF", "#FFD60A"],
      },
    ],
  };

  // Datos para gráfico de ventas por día de semana
  const ventasPorDiaData = {
    labels: tendencias?.ventasPorDiaSemana?.map((d) => d.dia) || [],
    datasets: [
      {
        label: "Ventas ($)",
        data: tendencias?.ventasPorDiaSemana?.map((d) => d.total) || [],
        backgroundColor: "#FF4D8D",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-fondo">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Encabezado */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <img src="/LOGO%20(2).jpeg" alt="d'vida" className="h-12 sm:h-14 object-contain" />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-serif mb-1 sm:mb-2">
              Reportes
            </h1>
            <p className="text-sm sm:text-base text-accent">
              Análisis detallado de ventas, inventario y clientes
            </p>
          </div>
        </div>

        {/* Filtros de fecha */}
        <div className="bg-secondary rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">
            Filtrar por período
          </h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-accent font-semibold mb-2 text-sm sm:text-base">
                Desde
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-accent font-semibold mb-2 text-sm sm:text-base">
                Hasta
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="input"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition text-sm sm:text-base w-full sm:w-auto"
            >
              🔍 Buscar
            </button>
            <button
              onClick={handleLimpiar}
              className="bg-fondo/50 border border-primary/30 text-accent px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-fondo/70 transition text-sm sm:text-base w-full sm:w-auto"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
          <button
            onClick={() => setPestaña("resumen")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
              pestaña === "resumen"
                ? "bg-primary text-white"
                : "bg-secondary text-accent border border-primary/20 hover:bg-sky-50"
            }`}
          >
            <span className="hidden sm:inline">📈 Resumen General</span>
            <span className="sm:hidden">📈 Resumen</span>
          </button>
          <button
            onClick={() => setPestaña("clientes")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
              pestaña === "clientes"
                ? "bg-primary text-white"
                : "bg-secondary text-accent border border-primary/20 hover:bg-sky-50"
            }`}
          >
            👥 Clientes
          </button>
          <button
            onClick={() => setPestaña("productos")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
              pestaña === "productos"
                ? "bg-primary text-white"
                : "bg-secondary text-accent border border-primary/20 hover:bg-sky-50"
            }`}
          >
            🛍️ Productos
          </button>
          <button
            onClick={() => setPestaña("inventario")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
              pestaña === "inventario"
                ? "bg-primary text-white"
                : "bg-secondary text-accent border border-primary/20 hover:bg-sky-50"
            }`}
          >
            📦 Inventario
          </button>
          <button
            onClick={() => setPestaña("tendencias")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
              pestaña === "tendencias"
                ? "bg-primary text-white"
                : "bg-secondary text-accent border border-primary/20 hover:bg-sky-50"
            }`}
          >
            📉 Tendencias
          </button>
        </div>

        {/* CONTENIDO POR PESTAÑA */}
        {pestaña === "resumen" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-fondo/60 p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm md:text-base">
                  Total Ventas
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-all">
                  ${Number(reportes?.resumen?.totalVentas || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-fondo/60 p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm md:text-base">
                  Total Órdenes
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {reportes?.resumen?.totalOrdenes || 0}
                </p>
              </div>
              <div className="bg-fondo/60 p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm md:text-base">
                  Promedio/Orden
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-all">
                  ${Number(reportes?.resumen?.promedioPorOrden || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-fondo/60 p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm md:text-base">
                  Completadas
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {reportes?.resumen?.ordenesCompletadas || 0}
                </p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                  Ventas por Mes
                </h3>
                <div className="h-64 sm:h-auto">
                  <Line data={ventasPorMesData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>

              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                  Métodos de Pago
                </h3>
                <div className="h-64 sm:h-auto">
                  <Doughnut
                    data={metodosPagoData}
                    options={{ responsive: true, maintainAspectRatio: true }}
                  />
                </div>
              </div>
            </div>

            {/* Top Productos */}
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                Top 5 Productos Más Vendidos
              </h3>
              <div className="h-64 sm:h-auto">
                <Bar
                  data={topProductosData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {pestaña === "clientes" && (
          <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
            <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
              Top 10 Clientes Frecuentes
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">Cliente</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">Email</th>
                      <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">Órdenes</th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">Total Gastado</th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFrecuentes?.topClientes?.map((cliente, index) => (
                      <tr
                        key={index}
                        className="border-b border-primary/10 hover:bg-primary/5"
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-textMain text-xs sm:text-sm md:text-base">
                          {cliente.cliente.nombre}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-accent text-xs sm:text-sm md:text-base">
                          {cliente.cliente.email}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-textMain text-xs sm:text-sm md:text-base">
                          {cliente.totalOrdenes}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-primary font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                          ${Number(cliente.totalGastado || 0).toFixed(2)}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-accent text-xs sm:text-sm md:text-base whitespace-nowrap">
                          ${Number(cliente.promedioOrden || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {pestaña === "productos" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                Productos Más Vendidos
              </h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base">
                          Producto
                        </th>
                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">
                          Cantidad
                        </th>
                        <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">
                          Ingresos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportes?.topProductos?.map((producto, index) => (
                        <tr
                          key={index}
                          className="border-b border-primary/10 hover:bg-primary/5"
                        >
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-textMain text-xs sm:text-sm md:text-base">
                            {producto.nombre}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-textMain text-xs sm:text-sm md:text-base">
                            {producto.cantidad}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-primary font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                            ${Number(producto.ingresos || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {pestaña === "inventario" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Resumen de inventario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-sm sm:text-base">
                  Total Productos
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {inventario?.resumen?.totalProductos || 0}
                </p>
              </div>
              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-accent font-semibold mb-2 text-sm sm:text-base">
                  Valor Inventario
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-primary break-all">
                  ${Number(inventario?.resumen?.valorInventario || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-red-500/20 border-2 sm:col-span-2 lg:col-span-1">
                <h3 className="text-accent font-semibold mb-2 text-sm sm:text-base">
                  ⚠️ Stock Bajo
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-red-500">
                  {inventario?.resumen?.stockBajo ?? 0}
                </p>
              </div>
            </div>

            {/* Alertas de stock bajo */}
            {inventario?.alertas?.stockBajo?.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-3 sm:mb-4">
                  🚨 Productos con Stock Bajo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {inventario.alertas.stockBajo.map((producto, index) => (
                      <div
                      key={index}
                      className="bg-fondo p-3 sm:p-4 rounded-lg border border-red-500/30"
                    >
                      <p className="text-textMain font-semibold text-xs sm:text-sm md:text-base truncate">
                        {producto.nombre}
                      </p>
                      <p className="text-red-500 text-xl sm:text-2xl font-bold">
                        {producto.stock}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventario por categoría */}
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                Inventario por Categoría
              </h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base">
                          Categoría
                        </th>
                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">
                          Productos
                        </th>
                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">
                          Stock Total
                        </th>
                        <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap">
                          Valor Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventario?.porCategoria?.map((cat, index) => (
                        <tr
                          key={index}
                          className="border-b border-primary/10 hover:bg-primary/5"
                        >
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-textMain capitalize text-xs sm:text-sm md:text-base">
                            {cat.categoria}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-textMain text-xs sm:text-sm md:text-base">
                            {cat.cantidad}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-textMain text-xs sm:text-sm md:text-base">
                            {cat.stockTotal}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-primary font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                            ${Number(cat.valorTotal || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {pestaña === "tendencias" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-primary/20">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                  Ventas por Día de la Semana
                </h3>
                <div className="h-64 sm:h-auto">
                  <Bar data={ventasPorDiaData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>


            </div>
          </div>
        )}
      </div>
    </div>
  );
}












