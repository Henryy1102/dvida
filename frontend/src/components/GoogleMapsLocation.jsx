import { useState, useEffect } from "react";

const RIOBAMBA_EJEMPLOS = [
  "Av. Amazonas",
  "Av. Daniel León Borja",
  "Av. Ordoñez Lasso",
  "Av. Loja",
  "Calle Bolívar",
  "Calle Chimborazo",
  "Calle Sucre",
  "Calle García Moreno",
  "Calle José María Velasco",
  "Av. Montalvo",
  "Plaza Mayor Riobamba",
  "Paseo Shopping Riobamba",
  "Parque Bolívar",
  "Av. Bolívar",
  "Av. Oriente",
  "Av. Los Andes",
  "Calle Constitución",
];

export default function GoogleMapsLocation({ onLocationSelect, initialLocation }) {
  const [ubicacionNombre, setUbicacionNombre] = useState(initialLocation?.direccion || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(initialLocation?.link ? initialLocation : null);

  useEffect(() => {
    if (!ubicacionNombre || ubicacionNombre.trim() === "") {
      setSuggestions([]);
      setError("");
      return;
    }

    const normalizedSelected = selected?.display_name?.trim().toLowerCase();
    const normalizedInput = ubicacionNombre.trim().toLowerCase();

    if (selected && normalizedSelected && normalizedSelected === normalizedInput) {
      setSuggestions([]);
      setError("");
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const query = `${ubicacionNombre.trim()}, Riobamba, Ecuador`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=ec&q=${encodeURIComponent(query)}`,
          {
            headers: {
              "Accept-Language": "es",
            },
          }
        );

        const data = await response.json();

        const riobambaResults = data.filter((item) => {
          const display = (item.display_name || "").toLowerCase();
          const address = item.address || {};
          const city = (address.city || address.town || address.village || "").toLowerCase();
          const state = (address.state || "").toLowerCase();
          const country = (address.country || "").toLowerCase();
          return (
            display.includes("riobamba") ||
            city.includes("riobamba") ||
            state.includes("chimborazo") ||
            country.includes("ecuador")
          );
        });

        const results = riobambaResults.length > 0 ? riobambaResults : data;
        setSuggestions(results);
        if (results.length === 0) {
          setError("No se encontraron resultados para Riobamba. Intenta con otra calle, plaza o tienda.");
        } else {
          setError("");
        }
      } catch (fetchError) {
        console.error("Error Nominatim:", fetchError);
        setError("No se pudieron obtener sugerencias. Intenta de nuevo.");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [ubicacionNombre]);

  const handleSelect = (item) => {
    const direccion = item.display_name;
    const link = `https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lon}#map=18/${item.lat}/${item.lon}`;

    setSelected({ ...item, direccion, link });
    setUbicacionNombre(direccion);
    setSuggestions([]);
    setError("");

    onLocationSelect({
      direccion,
      link,
      latitud: item.lat,
      longitud: item.lon,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-accent font-semibold mb-2">
          📍 Ubicación de Entrega en Riobamba
        </label>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded">
          <p className="text-sm text-gray-700 mb-3">
            Escribe tu calle, avenida o referencia en Riobamba. El sistema sugerirá lugares reales en la ciudad.
          </p>
          <p className="text-xs text-gray-600">
            Ejemplo: <strong>Av. Bernardino Rivadavia</strong>, <strong>Calle Chimborazo</strong>, <strong>Av. Daniel León Borja</strong>.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔎 Busca tu ubicación en Riobamba
          </label>
          <input
            value={ubicacionNombre}
            onChange={(e) => {
              setUbicacionNombre(e.target.value);
              setSelected(null);
            }}
            placeholder="Ej: Av. Amazonas"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400"
          />
        </div>

        {loading && (
          <div className="mt-3 p-3 bg-white border border-blue-200 rounded text-sm text-gray-700">
            Buscando sugerencias en Riobamba...
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-600">Selecciona una sugerencia:</p>
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={`${item.place_id}-${item.lat}-${item.lon}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-slate-50 transition"
                >
                  <p className="text-sm text-gray-800 font-semibold truncate">{item.display_name}</p>
                  <p className="text-xs text-gray-500">Riobamba, Ecuador</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selected && (
          <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded">
            <p className="text-sm font-semibold text-green-900 mb-2">✅ Ubicación seleccionada</p>
            <p className="text-xs text-gray-700 mb-3">{selected.display_name}</p>
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition font-semibold"
            >
              🗺️ Ver en OpenStreetMap
            </a>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
        <p className="text-xs text-yellow-800">
          <strong>💡 Importante:</strong> Ingresa la calle o referencia de Riobamba y selecciona una sugerencia. Así generamos una ubicación precisa en OpenStreetMap.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-700 mb-2">Lugares de ejemplo en Riobamba:</p>
        <div className="flex flex-wrap gap-2">
          {RIOBAMBA_EJEMPLOS.map((item) => (
            <span key={item} className="px-3 py-1 bg-slate-100 text-xs text-gray-700 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

