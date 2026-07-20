import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { carrito, items, removeFromCart, updateQuantity, clearCart, total } = useCartStore();
  
  // Usar carrito si existe, sino items para compatibilidad
  const cartItems = carrito.length > 0 ? carrito : (items || []);

  return (
    <div style={{background: '#ffffff', minHeight: '100vh'}}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{color: '#000000'}}>🛍️ Mi Carrito</h1>
          <button 
            onClick={() => navigate("/catalog")}
            className="font-semibold hover:text-blue-600 transition text-sm sm:text-base self-start md:self-auto"
            style={{color: '#000000'}}
          >
            ← Seguir comprando
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center border border-gray-300">
            <p className="text-base sm:text-lg mb-4" style={{color: '#0052a3'}}>Tu carrito está vacío</p>
            <button 
              onClick={() => navigate("/catalog")}
              className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition font-semibold text-sm sm:text-base"
              style={{background: 'linear-gradient(135deg, #0052a3 0%, #003d7a 100%)'}}
            >
              Ir al catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 border border-gray-300">
              {cartItems.map((item) => {
                // Compatibilidad con estructura antigua {product, quantity}
                const product = item.product || item;
                const quantity = item.quantity || item.cantidad || 1;
                const productId = item.product?._id || item._id;
                
                return (
                  <div key={productId} className="p-3 sm:p-4 md:p-6 border-b border-gray-300 last:border-b-0 hover:bg-blue-50 transition">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
                      {product.imagen && (
                        <img src={product.imagen} alt={product.nombre} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded self-start" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate" style={{color: '#000000'}}>{product.nombre}</h3>
                        <p className="text-xs sm:text-sm" style={{color: '#0052a3'}}>{product.categoria}</p>
                        <p className="font-semibold text-base sm:text-lg" style={{color: '#000000'}}>${product.precio?.toLocaleString()} c/u</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-300">
                          <button
                            className="text-white w-8 h-8 rounded flex items-center justify-center font-bold transition text-sm hover:shadow"
                            style={{background: 'linear-gradient(135deg, #0052a3 0%, #003d7a 100%)'}}
                            onClick={() => updateQuantity(productId, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => updateQuantity(productId, Number(e.target.value) || 1)}
                            className="w-10 sm:w-12 border-0 bg-transparent text-center font-semibold text-sm"
                            style={{color: '#0f172a'}}
                          />
                          <button
                            className="text-white w-8 h-8 rounded flex items-center justify-center font-bold transition text-sm hover:shadow"
                            style={{background: 'linear-gradient(135deg, #0052a3 0%, #003d7a 100%)'}}
                            onClick={() => updateQuantity(productId, quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="font-bold text-base sm:text-lg text-center sm:w-24 sm:text-right" style={{color: '#000000'}}>${(product.precio * quantity).toLocaleString()}</span>
                        
                        <button
                          className="hover:bg-red-100 border px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-xs sm:text-sm"
                          style={{borderColor: '#dc2626', color: '#dc2626'}}
                          onClick={() => removeFromCart(productId)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
                <span className="text-lg sm:text-xl font-medium" style={{color: '#000000'}}>
                  Subtotal ({cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}):
                </span>
                <span className="text-3xl sm:text-4xl font-semibold" style={{color: '#000000'}}>${total().toLocaleString()}</span>
              </div>
              
              <p className="text-xs sm:text-sm mb-6" style={{color: '#000000'}}>
                El IVA (13%) y otros cargos se calcularán en el checkout
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate("/checkout")}
                  className="flex-1 text-white text-base sm:text-lg py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  style={{background: 'linear-gradient(135deg, #0052a3 0%, #003d7a 100%)'}}
                >
                  Proceder al Checkout
                </button>
                <button
                  className="text-sm sm:text-base py-3 px-4 rounded-lg font-semibold border transition hover:bg-gray-50"
                  style={{borderColor: '#e0e7ff', color: '#000000'}}
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}






