import { useEffect, useRef, useState } from "react";
import { useProductStore } from "../store/productStore";
import { Link, useNavigate } from "react-router-dom";
import productService from "../services/productService";

const CATEGORIAS = ["Agua", "Envases"];

export default function Home() {
  const navigate = useNavigate();
  const { products, fetchProducts, loading, error } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [recomendados, setRecomendados] = useState([]);
  const proccessImageRef = useRef(null);

  const handleImageFullscreen = () => {
    const imgElement = proccessImageRef.current;
    if (!imgElement) return;

    if (imgElement.requestFullscreen) {
      imgElement.requestFullscreen();
    } else if (imgElement.webkitRequestFullscreen) {
      imgElement.webkitRequestFullscreen();
    } else if (imgElement.mozRequestFullScreen) {
      imgElement.mozRequestFullScreen();
    } else if (imgElement.msRequestFullscreen) {
      imgElement.msRequestFullscreen();
    }
  };
  const [loadingRecomendados, setLoadingRecomendados] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const cargarRecomendados = async () => {
      setLoadingRecomendados(true);
      try {
        const data = await productService.getRecommendations(6);
        setRecomendados(data || []);
      } catch (err) {
        console.error("Error cargando recomendaciones:", err);
      } finally {
        setLoadingRecomendados(false);
      }
    };

    cargarRecomendados();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  let filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.categoria?.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (onlyAvailable) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }

  if (sortBy === 'precio-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.precio - b.precio);
  } else if (sortBy === 'precio-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.precio - a.precio);
  } else if (sortBy === 'nombre') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return (
    <div className="min-h-screen bg-fondo text-textMain">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-500 to-slate-900">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_30%)]" />

        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
                Agua alcalina premium en Riobamba</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                d'vida
              </h1>
              <p className="text-3xl sm:text-4xl font-semibold text-white/95 max-w-xl mx-auto lg:mx-0 leading-tight">
                Tu agua alcalina confiable con entrega rápida y pago seguro.
              </p>
              <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-white/80 leading-7">
                Encuentra productos de alta calidad, ofertas especiales y un proceso de compra diseñado para que tu experiencia sea rápida y segura desde el primer sorbo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/catalog" className="btn-primary inline-flex items-center justify-center">
                  Ver catálogo
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-card bg-white text-sky-700 hover:bg-slate-100 transition-all duration-300 font-semibold border border-white/30 shadow-sm shadow-slate-950/10">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-card bg-gradient-to-r from-cyan-400 to-sky-600 text-white hover:from-cyan-500 hover:to-sky-700 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/20">
                  Regístrate
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 text-sm text-white/85">
                <div className="bg-white/10 rounded-3xl p-4">
                  <p className="font-semibold">100% Local</p>
                  <p className="mt-1">Riobamba y alrededores</p>
                </div>
                <div className="bg-white/10 rounded-3xl p-4">
                  <p className="font-semibold">Entrega rápida</p>
                  <p className="mt-1">Dentro de pocas horas</p>
                </div>
                <div className="bg-white/10 rounded-3xl p-4">
                  <p className="font-semibold">Pago seguro</p>
                  <p className="mt-1">Transferencia o Efectivo</p>
                </div>
                <div className="bg-white/10 rounded-3xl p-4">
                  <p className="font-semibold">Soporte 24/7</p>
                  <p className="mt-1">Siempre disponible</p>
                </div>
              </div>
            </div>

            <div className="rounded-[36px] overflow-hidden shadow-2xl shadow-slate-950/15 border border-white/10 bg-white/10 backdrop-blur-xl flex items-center justify-center bg-slate-950/5">
              <img
                src="/LOGO%20(2).jpeg"
                alt="Logo d'vida"
                className="w-full max-h-[420px] object-contain p-10 bg-white/10"
                onError={(e) => { e.currentTarget.src = "/hero-image.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-7xl">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-3">Navega fácil</h2>
            <p className="text-sm text-subtext leading-6">Busca por categoría, nombre o precio y encuentra tu agua favorita sin complicaciones.</p>
          </div>
          <div className="card p-6 bg-sky-50 border border-sky-200">
            <h2 className="text-xl font-semibold mb-3">Especial Riobamba</h2>
            <p className="text-sm text-textMain leading-6">Solo productos locales con entregas rápidas y atención dedicada en tu ciudad.</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-3">Compra segura</h2>
            <p className="text-sm text-subtext leading-6">Tu información se mantiene protegida y el pago es confiable en cada paso.</p>
          </div>
        </section>

        <section className="card p-6 mb-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">Nuestro proceso de purificación</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-textMain">Agua limpia, segura y lista para ti</h2>
              <p className="text-sm text-subtext leading-7">En nuestra planta utilizamos un sistema de purificación de múltiples etapas para garantizar agua de alta calidad, libre de impurezas y segura para el consumo.</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">1. Tanque de agua cruda</p>
                  <p className="text-sm text-subtext">Almacena el agua que ingresa a la planta.</p>
                </div>
                <div>
                  <p className="font-semibold">2. Bomba de presión e hidroneumático</p>
                  <p className="text-sm text-subtext">Mantienen una presión constante para todo el sistema.</p>
                </div>
                <div>
                  <p className="font-semibold">3. Filtro de zeolita</p>
                  <p className="text-sm text-subtext">Elimina arena, sedimentos y partículas grandes.</p>
                </div>
                <div>
                  <p className="font-semibold">4. Filtro de carbón activado</p>
                  <p className="text-sm text-subtext">Reduce olores, sabores y elimina el cloro.</p>
                </div>
                <div>
                  <p className="font-semibold">5. Suavizador de agua</p>
                  <p className="text-sm text-subtext">Disminuye la dureza eliminando calcio y magnesio.</p>
                </div>
                <div>
                  <p className="font-semibold">6. Ósmosis inversa</p>
                  <p className="text-sm text-subtext">Remueve hasta el 99% de sales, bacterias, virus y otros contaminantes.</p>
                </div>
                <div>
                  <p className="font-semibold">7. Tanque de agua purificada</p>
                  <p className="text-sm text-subtext">Conserva el agua lista para el proceso de llenado.</p>
                </div>
                <div>
                  <p className="font-semibold">8. Luz ultravioleta</p>
                  <p className="text-sm text-subtext">Desinfecta el agua eliminando microorganismos.</p>
                </div>
                <div>
                  <p className="font-semibold">9. Generador de ozono</p>
                  <p className="text-sm text-subtext">Proporciona una desinfección adicional antes del embotellado.</p>
                </div>
                <div>
                  <p className="font-semibold">10. Lavado y llenado de garrafones</p>
                  <p className="text-sm text-subtext">Los envases son lavados, desinfectados y llenados bajo condiciones higiénicas.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 p-2 lg:p-4">
              <img
                ref={proccessImageRef}
                src="/Proceso.jpeg"
                alt="Proceso de purificación de agua"
                className="w-full h-full max-h-[720px] object-cover cursor-pointer"
                onClick={handleImageFullscreen}
              />
            </div>
          </div>
        </section>

        <section className="card p-6 mb-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">Equipamiento principal</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-textMain">Tecnología especializada en nuestra planta</h2>
              <p className="text-sm text-subtext leading-7">Nuestra planta cuenta con tecnología especializada para ofrecer agua purificada con altos estándares de calidad.</p>

              <ul className="space-y-3 text-sm text-subtext">
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Tanques de almacenamiento.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Sistema hidroneumático.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Filtro multimedia.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Filtro de carbón activado.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Suavizador de agua.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Equipo de ósmosis inversa.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Filtros pulidores.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Lámpara ultravioleta (UV).</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Generador de ozono.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Lavadora de garrafones.</li>
                <li className="flex items-start gap-3"><span className="text-primary">✅</span>Mesa de llenado y sellado.</li>
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 p-2 lg:p-4">
              <img
                src="/Equipos.jpeg"
                alt="Equipos de la planta"
                className="w-full h-full max-h-[720px] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-2">Buscar productos</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-textMain">Encuentra lo que necesitas</h2>
            </div>
            <div className="flex-1">
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-card focus:outline-none focus:border-primary text-textMain placeholder-subtext transition-all text-sm sm:text-base"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input px-4 py-3 rounded-card text-textMain text-sm transition-all"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input px-4 py-3 rounded-card text-textMain text-sm transition-all"
            >
              <option value="">Ordenar por</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre">Nombre A-Z</option>
            </select>

            <label className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-card bg-white cursor-pointer hover:border-primary transition-all text-sm text-textMain">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span>Solo disponibles</span>
            </label>

            <div className="rounded-card border border-gray-200 bg-slate-50 p-4 flex items-center justify-between text-sm text-subtext">
              <span>{filteredProducts.length} productos</span>
              <span className="text-primary font-semibold">Filtrado en tiempo real</span>
            </div>
          </div>
        </section>

        {recomendados.length > 0 && (
          <section className="mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Productos destacados</h2>
                <p className="text-sm text-subtext">Selección recomendada para ti en Riobamba.</p>
              </div>
              {loadingRecomendados && <span className="text-sm text-subtext">Cargando...</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {recomendados.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`} 
                    className="group overflow-hidden rounded-[28px] border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                  <div className="relative h-52 overflow-hidden bg-white p-4 flex items-center justify-center">
                    {p.imagen ? (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-sm text-subtext">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">{p.categoria || "Categoría"}</p>
                    </div>
                    <h3 className="text-base font-semibold text-textMain line-clamp-2 mb-3">{p.nombre}</h3>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold text-primary">${p.precio?.toFixed(2)}</span>
                      <span className="text-xs text-subtext">{p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {loading && <p className="text-subtext">Cargando productos...</p>}
        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-card mb-6 border border-red-200">{error}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
              <div key={p._id} className="card-hover flex flex-col overflow-hidden group">
              <Link to={`/product/${p._id}`} className="relative">
                <div className="h-64 overflow-hidden bg-white p-6 flex items-center justify-center">
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-subtext">Sin imagen</div>
                  )}
                </div>
              </Link>

                <div className="p-5 flex flex-col flex-1">
                {p.categoria && (
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.24em] bg-primary/10 text-primary mb-3">
                    {p.categoria}
                  </span>
                )}
                <Link to={`/product/${p._id}`}>
                  <h3 className="text-lg font-semibold text-textMain mb-3 line-clamp-2">{p.nombre}</h3>
                </Link>
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-primary mb-3">${p.precio?.toFixed(2)}</p>
                  <p className="text-sm text-subtext mb-4">{p.stock > 0 ? `${p.stock} en stock` : "Agotado"}</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-3 rounded-card btn-primary text-white"
                  >
                    Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 card">
            <p className="text-textMain text-lg">{searchTerm ? "No se encontraron productos" : "No hay productos disponibles"}</p>
          </div>
        )}

        <footer className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-[26px] border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Ubicación</h3>
              <p className="text-sm text-subtext">Riobamba - Ecuador</p>
              <p className="text-sm text-subtext"></p>
            </div>
            <div className="rounded-[26px] border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Horario</h3>
              <p className="text-sm text-subtext">Lun - Dom: 07:00 AM - 17:00 PM</p>
              
            </div>
            <div className="rounded-[26px] border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Contacto</h3>
              <p className="text-sm text-subtext">Tel : +593 98 998 9317</p>
              <p className="text-sm text-subtext">Tel : +593 99 326 5337</p>
              <p className="text-sm text-subtext break-all">Email: aguadevida@gmail.com</p>
            </div>
            <div className="rounded-[26px] border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Redes Sociales</h3>
              <div className="flex flex-col gap-2 text-sm text-primary">
                <a href="#" className="hover:underline">Facebook</a>
                <a href="#" className="hover:underline">Instagram</a>
              </div>
            </div>
          </div>

          <div className="mt-10 py-6 text-center text-sm text-subtext border-t border-slate-200">
            © 2026 d'vida – Todos los derechos reservados
          </div>
        </footer>
      </main>
    </div>
  );
}













