# Manual Técnico - d'vida

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Requisitos Técnicos](#requisitos-técnicos)
4. [Instalación de Desarrollo](#instalación-de-desarrollo)
5. [Estructura de Directorios](#estructura-de-directorios)
6. [Base de Datos](#base-de-datos)
7. [API Endpoints](#api-endpoints)
8. [Autenticación](#autenticación)
9. [Frontend](#frontend)
10. [Deployment](#deployment)
11. [Mantenimiento](#mantenimiento)
12. [Troubleshooting](#troubleshooting)
13. [Contribuciones](#contribuciones)

---

## Introducción

Este manual está dirigido a desarrolladores y técnicos que necesitan entender, mantener o extender la plataforma d'vida. Cubre aspectos técnicos profundos de la aplicación.

### Stack Tecnológico

**Backend:**
- Node.js 16+ con Express.js
- MongoDB como base de datos
- JWT para autenticación
- Multer para uploads de archivos

**Frontend:**
- React 18+
- Vite como build tool
- Tailwind CSS para estilos
- Zustand para estado global

---

## Arquitectura del Sistema

### Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                      Cliente (Browser)                       │
│                    React + Vite + Tailwind                   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Express)                     │
│                  cors, auth middleware, etc                  │
└────────────┬───────────────┬───────────────┬────────────────┘
             │               │               │
        ┌────v─────┐    ┌────v─────┐   ┌────v──────┐
        │ Routes   │    │ Routes   │   │ Routes    │
        │ (Auth)   │    │ (Payment)│   │ (Products)│
        └────┬─────┘    └────┬─────┘   └────┬──────┘
             │               │               │
        ┌────v─────────────────────────────────┐
        │      Controllers (Lógica)            │
        └────┬─────────────────────────────────┘
             │
        ┌────v─────────────────────────────────┐
        │      Models (Mongoose)                │
        └────┬─────────────────────────────────┘
             │
        ┌────v─────────────────────────────────┐
        │      MongoDB (Base de datos)          │
        └──────────────────────────────────────┘
```

### Patrón MVC Modificado

```
Request
  ↓
Route (/api/products/search)
  ↓
Middleware (Auth, Validation)
  ↓
Controller (product.controller.js)
  ↓
Model (Product.js) → MongoDB
  ↓
Response (JSON)
```

---

## Requisitos Técnicos

### Hardware Mínimo

- **CPU:** 2 núcleos
- **RAM:** 2 GB (desarrollo), 4 GB (producción)
- **Almacenamiento:** 5 GB

### Software Requerido

```bash
# Verificar versiones
node --version    # v16.0.0 o superior
npm --version     # v7.0.0 o superior
git --version     # v2.0 o superior
```

### Servicios Externos

- **MongoDB Atlas** - Base de datos en la nube
- **SMTP** (opcional) - Para envío de emails
- **CDN** (opcional) - Para servir imágenes

---

## Instalación de Desarrollo

### 1. Preparar Ambiente

```bash
# Clonar repositorio
git clone <URL>
cd dvida

# Crear rama de trabajo
git checkout -b develop
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cat > .env << EOF
PORT=4000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/dvida
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_123456789
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
EOF

# Iniciar servidor
npm start
# ✓ Servidor corriendo en puerto 4000
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
cat > .env.local << EOF
VITE_API_URL=http://localhost:4000
EOF

# Iniciar servidor de desarrollo
npm run dev
# ✓ Frontend disponible en http://localhost:5173
```

### 4. Inicializar Base de Datos

```bash
cd backend

# Crear usuario admin
node src/scripts/createAdmin.js

# Cargar datos iniciales (opcional)
node src/scripts/seedData.js
```

### 5. Verificar Instalación

```bash
# Backend debe responder
curl http://localhost:4000/api/settings

# Frontend debe estar disponible
# Abre http://localhost:5173 en el navegador
```

---

## Estructura de Directorios

### Backend

```
backend/
├── src/
│   ├── index.js                 # Archivo principal
│   ├── config/
│   │   └── db.js               # Conexión MongoDB
│   ├── models/
│   │   ├── Users.js            # Modelo de usuarios
│   │   ├── Products.js         # Modelo de productos
│   │   ├── Orders.js           # Modelo de órdenes
│   │   ├── Invoice.js          # Modelo de facturas
│   │   ├── Payment.js          # Modelo de pagos
│   │   └── ... otros modelos
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── ... otros controladores
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── ... otros rutas
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT validation
│   │   ├── audit.middleware.js  # Logging de cambios
│   │   └── errorHandler.js      # Manejo de errores
│   ├── utils/
│   │   ├── pdfGenerator.js      # Generación de PDF
│   │   ├── xmlGenerator.js      # Generación de XML
│   │   └── validators.js        # Validaciones
│   └── scripts/
│       ├── createAdmin.js       # Crear usuario admin
│       ├── seedData.js          # Datos de prueba
│       └── resetSettings.js     # Reset de configuración
├── package.json
├── .env                         # Configuración (no versionar)
└── .gitignore
```

### Frontend

```
frontend/
├── src/
│   ├── main.jsx                 # Punto de entrada
│   ├── App.jsx                  # Componente raíz
│   ├── index.css                # Estilos globales
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── GoogleMapsLocation.jsx
│   │   └── ... otros componentes
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Catalog.jsx
│   │   ├── Checkout.jsx
│   │   ├── AdminSettings.jsx
│   │   └── ... otras páginas
│   ├── services/
│   │   ├── authService.js       # Servicios de auth
│   │   ├── productService.js    # Servicios de productos
│   │   ├── orderService.js      # Servicios de órdenes
│   │   ├── paymentService.js    # Servicios de pagos
│   │   └── ... otros servicios
│   ├── store/
│   │   ├── authStore.js         # Estado de autenticación
│   │   ├── cartStore.js         # Estado del carrito
│   │   ├── productStore.js      # Estado de productos
│   │   └── ... otros stores
│   └── utils/
│       ├── pdfReports.js        # Generación de PDF cliente
│       └── formatters.js        # Formateadores
├── public/
│   ├── logo.png
│   └── ... archivos estáticos
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.local                   # Configuración local
└── .gitignore
```

---

## Base de Datos

### Conexión MongoDB

**Archivo:** `backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error MongoDB:', error);
    process.exit(1);
  }
};
```

### Modelos Principales

#### Users

```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (único),
  contraseña: String (hash),
  rol: String (user|admin), // default: user
  telefono: String,
  datosFacturacion: {
    tipoIdentificacion: String,
    numeroIdentificacion: String,
    razonSocial: String,
    direccion: String,
    telefono: String,
    correo: String
  },
  estado: Boolean, // default: true
  createdAt: Date,
  updatedAt: Date
}
```

#### Products

```javascript
{
  _id: ObjectId,
  nombre: String (requerido),
  descripcion: String,
  categoria: String,
  precio: Number (requerido),
  stock: Number,
  imagen: String,
  especificaciones: {
    volumen: String,
    contenidoAlcohol: String,
    marca: String
  },
  activo: Boolean, // default: true
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders

```javascript
{
  _id: ObjectId,
  usuario: ObjectId (ref: Users),
  cliente: ObjectId (ref: Clients),
  productos: [{
    producto: ObjectId,
    cantidad: Number,
    precioUnitario: Number,
    subtotal: Number
  }],
  subtotal: Number,
  impuesto: Number,
  total: Number,
  direccionEntrega: String,
  metodoPago: String (efectivo|transferencia),
  estadoPago: String (pendiente|confirmado|rechazado),
  estadoEntrega: String (pendiente|despachada|entregada),
  notas: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Invoices

```javascript
{
  _id: ObjectId,
  numeroFactura: String (único),
  orden: ObjectId (ref: Orders),
  usuario: ObjectId (ref: Users),
  datosFacturacion: {
    razonSocial: String,
    identificacion: String,
    direccion: String
  },
  total: Number,
  fecha: Date,
  estado: String (emitida|anulada),
  createdAt: Date
}
```

### Índices Recomendados

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Products
db.products.createIndex({ categoria: 1 })
db.products.createIndex({ nombre: "text", descripcion: "text" })

// Orders
db.orders.createIndex({ usuario: 1 })
db.orders.createIndex({ estadoPago: 1 })
db.orders.createIndex({ createdAt: -1 })

// Invoices
db.invoices.createIndex({ numeroFactura: 1 }, { unique: true })
db.invoices.createIndex({ orden: 1 })
```

---

## API Endpoints

### Autenticación

```
POST   /api/auth/register           Registrar usuario
POST   /api/auth/login              Iniciar sesión
POST   /api/auth/logout             Cerrar sesión
GET    /api/auth/me                 Obtener usuario actual
POST   /api/auth/refresh            Refrescar token
```

### Productos

```
GET    /api/products                Listar productos
GET    /api/products/search         Buscar productos
GET    /api/products/:id            Obtener detalles
POST   /api/products                Crear producto (admin)
PUT    /api/products/:id            Actualizar producto (admin)
DELETE /api/products/:id            Eliminar producto (admin)
```

### Órdenes

```
GET    /api/orders                  Mis órdenes
GET    /api/orders/:id              Detalles orden
POST   /api/orders                  Crear orden
PUT    /api/orders/:id              Actualizar orden
PUT    /api/orders/:id/cancel       Cancelar orden
```

### Pagos

```
GET    /api/payments/settings       Obtener configuración
PUT    /api/payments/settings       Actualizar configuración (admin)
PUT    /api/payments/:ordenId/confirmar   Confirmar pago (admin)
PUT    /api/payments/:ordenId/rechazar    Rechazar pago (admin)
GET    /api/payments/resumen        Resumen de pagos (admin)
```

### Usuarios (Admin)

```
GET    /api/users                   Listar usuarios (admin)
GET    /api/users/:id               Detalles usuario (admin)
PUT    /api/users/:id               Actualizar usuario (admin)
DELETE /api/users/:id               Eliminar usuario (admin)
```

### Facturas

```
GET    /api/invoices                Mis facturas
GET    /api/invoices/:id            Descargar factura
POST   /api/invoices                Crear factura (admin)
```

### Reseñas

```
GET    /api/reviews/:productId      Reseñas de producto
POST   /api/reviews                 Crear reseña
PUT    /api/reviews/:id             Actualizar reseña
DELETE /api/reviews/:id             Eliminar reseña
```

---

## Autenticación

### JWT (JSON Web Tokens)

Los tokens JWT se usan para autenticar requests. Estructura:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI1ZmY0YzFjNzYwY2NlZDA4YzQ3ZjI4YzIiLCJyb2wiOiJ1c2VyIiwiaWF0IjoxNjEwMDAwMDAwfQ.
xxxxxxxxxxxxx
```

### Middleware de Autenticación

```javascript
// backend/src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Uso en Frontend

```javascript
// Guardar token después de login
localStorage.setItem('token', response.data.token);

// Enviar token en requests
const token = localStorage.getItem('token');
fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Borrar token al cerrar sesión
localStorage.removeItem('token');
```

---

## Frontend

### Zustand Store Pattern

```javascript
// store/cartStore.js
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  carrito: [],
  
  agregarProducto: (producto, cantidad) => set((state) => ({
    carrito: [...state.carrito, { ...producto, cantidad }]
  })),
  
  eliminarProducto: (productoId) => set((state) => ({
    carrito: state.carrito.filter(p => p._id !== productoId)
  })),
  
  getTotal: () => {
    const state = get();
    return state.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
}));
```

### Componentes Principales

**Navbar.jsx**
- Navegación principal
- Login/Logout
- Links a páginas

**GoogleMapsLocation.jsx**
- Selección de ubicación
- Integración con Google Maps API

**Checkout.jsx**
- Proceso de compra en 4 pasos
- Validación de datos
- Resumen de pago

### Rutas (React Router)

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/catalog" element={<Catalog />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/checkout" element={<Checkout />} />
  
  {/* Rutas protegidas */}
  <Route path="/mis-ordenes" element={<ProtectedRoute><MisOrdenes /></ProtectedRoute>} />
  <Route path="/facturas" element={<ProtectedRoute><Facturas /></ProtectedRoute>} />
  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
  
  {/* Rutas admin */}
  <Route path="/admin/*" element={<AdminLayout />} />
</Routes>
```

---

## Deployment

### Heroku (Backend)

```bash
# Login
heroku login

# Crear app
heroku create dvida-backend

# Configurar variables de entorno
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=tu_clave

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Vercel (Frontend)

```bash
# Login
vercel login

# Deploy
vercel deploy

# Configurar variables de entorno en dashboard
VITE_API_URL=https://dvida-backend.herokuapp.com
```

### Render (Alternativa a Heroku)

```bash
# Conectar repositorio GitHub
# Configurar environment variables
# Auto-deploy en cada push
```

### Variables de Entorno en Producción

**Backend (.env)**
```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dvida
JWT_SECRET=clave_muy_segura_y_larga_aqui
FRONTEND_URL=https://dvida.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=contraseña_aplicación
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://dvida-backend.herokuapp.com
```

---

## Mantenimiento

### Backups

```bash
# MongoDB Atlas auto-realiza backups diarios

# Backup manual
mongobackup --uri="mongodb+srv://..." --out=./backup
```

### Logs

**Backend:**
```bash
# Ver logs en servidor
tail -f logs/app.log

# Logs en producción
heroku logs --tail
```

### Monitoreo

- **Uptime:** Usar Pingdom o UptimeRobot
- **Performance:** New Relic o DataDog
- **Errores:** Sentry para rastrear errores

### Limpieza de Base de Datos

```bash
# Eliminar órdenes antiguas
db.orders.deleteMany({ createdAt: { $lt: new Date("2023-01-01") } })

# Eliminar usuarios inactivos
db.users.deleteMany({ ultimoLogin: { $lt: new Date("2023-01-01") } })
```

---

## Troubleshooting

### Backend no inicia

```bash
# Error: ECONNREFUSED (MongoDB no conecta)
# Solución: Verificar MONGODB_URI en .env

# Error: Port 4000 already in use
# Solución: 
lsof -i :4000        # Listar proceso
kill -9 <PID>        # Matar proceso
# O cambiar puerto en .env

# Error: JWT signature invalid
# Solución: Regenerar JWT_SECRET en .env
```

### Frontend no conecta con Backend

```bash
# Error: CORS (Cross-Origin Request Blocked)
# Solución: Verificar CORS en backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

# Error: API not found
# Solución: Verificar que backend esté corriendo en puerto 4000
```

### Base de datos lenta

```bash
# Ejecutar análisis de consultas
db.orders.find().explain("executionStats")

# Crear índices
db.orders.createIndex({ usuario: 1, createdAt: -1 })

# Monitorizar uso de memoria
mongo --eval "db.stats()"
```

---

## Contribuciones

### Workflow de Desarrollo

1. **Fork** del repositorio
2. Crear rama: `git checkout -b feature/mi-feature`
3. Commits: `git commit -am 'Agregue feature'`
4. Push: `git push origin feature/mi-feature`
5. Pull Request

### Estándares de Código

```javascript
// ✅ Bueno
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find().limit(10);
    res.json(productos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// ❌ Evitar
const get = async (q, r) => {
  const p = await Product.find();
  r.json(p);
};
```

### Testing

```bash
# Backend
npm test

# Frontend
npm run test

# Coverage
npm run test:coverage
```

---

## Recursos Adicionales

- [Documentación Node.js](https://nodejs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**¡Gracias por contribuir a d'vida!**

**Última actualización:** Julio 2024
