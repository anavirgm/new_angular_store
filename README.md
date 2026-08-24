# AURA Store — E-Commerce SPA (Angular)

Single Page Application (SPA) desarrollada en Angular 21 para explorar productos de la **Fake Store API**, autenticarse y gestionar un carrito de compras. El proyecto implementa componentes standalone, rutas lazy-loaded, Signals, validación de sesión y control de acceso.

**Demo en vivo:** [aurastoreee.vercel.app](https://aurastoreee.vercel.app/)

---

## 📋 Requerimientos Cumplidos

### Requerimientos Funcionales
* **Autenticación Real:** Consumo del endpoint `/auth/login`, almacenamiento persistente del token JWT y validación de estructura y expiración antes de aceptar la sesión.
* **Catálogo & Filtros:** Exploración de productos en tiempo real con filtrado dinámico por categorías y búsqueda local por nombre, descripción o categoría.
* **Carrito Interactivo:** Agregar productos, ajustar cantidades (`+` / `-`), eliminar ítems, persistir el carrito al recargar y calcular en vivo el monto total y contador de productos.

### Requerimientos Técnicos
* **Arquitectura de Layouts:**
  * `AuthLayout`: Layout independiente y limpio exclusivo para autenticación (sin barras de navegación).
  * `MainLayout`: Layout principal con Header persistente (contador en vivo), Footer corporativo y páginas legales.
  * `shared/components`: Componentes reutilizables de presentación para el Header y Footer.
* **Manejo de Estado Reactivo:** Uso de **Angular Signals** (`signal`, `computed`) para el estado global del carrito y la sesión de usuario de forma eficiente.
* **Enrutamiento & Seguridad:** Carga perezosa (*Lazy Loading*) en todas las rutas modulares y protección de la vista privada del carrito mediante `authGuard`.
* **Buenas Prácticas:**
  * `authInterceptor`: Inyección del token solo en peticiones a `fakestoreapi.com`, exclusión explícita del login, cierre de sesión ante errores `401` y registro de errores `5xx` mediante un servicio dedicado.
  * Feedback visual mediante spinner, *Skeleton Loaders*, alertas y toast de acciones.
  * Interfaz responsiva, accesible y con estilos centralizados en CSS.

### Calidad y pruebas
* Tests unitarios para autenticación, guard, interceptor, catálogo, carrito y layout principal.
* Cobertura de tokens inválidos/expirados, dominios externos, login inválido, persistencia y errores de categorías.
* Ejecución verificada: `59/59` pruebas correctas.

---

## 🛠️ Tecnologías utilizadas

* **Framework:** Angular 21 (Standalone Components)
* **Estado & Reactividad:** Angular Signals & RxJS
* **Estilos:** CSS3 nativo (Diseño personalizado)
* **API:** Fake Store API (`https://fakestoreapi.com`)

### Rutas principales
* `/`: catálogo de productos.
* `/auth/login`: autenticación sin navegación de tienda.
* `/cart`: carrito protegido por `authGuard`.
* `/terms`: términos y condiciones.
* `/privacy`: política de privacidad.

---

## 🔑 Credenciales de Acceso

Para probar la autenticación de la aplicación, utiliza las credenciales proporcionadas por la API:

* **Usuario:** `mor_2314`
* **Contraseña:** `83r5^_`

---

## 🚀 Cómo correrlo en local

Si quieres clonar el proyecto e instalarlo localmente:

1. **Clonar el repositorio:**
    ```bash
    git clone https://github.com/anavirgm/new_angular_store.git
    cd new_angular_store
    ```

2. **Instalar las dependencias:**
    ```bash
    npm install
    ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   ng serve
   ```

La aplicación estará disponible en http://localhost:4200.

### Comandos disponibles

```bash
npm start                 # Servidor de desarrollo
npm test -- --watch=false # Ejecutar las pruebas una vez
npm run build             # Generar el bundle de producción
```

---

## 🧠 Decisiones Técnicas

* **Manejo de estado con Signals:** Se eligieron Angular Signals para administrar el estado reactivo del carrito y de la sesión en `CartService` y `AuthService`. `signal()` almacena los datos que pueden cambiar, mientras `computed()` calcula automáticamente valores derivados como la cantidad de productos y el total del carrito. Esta solución es suficiente para el alcance de la aplicación, mantiene el código simple y evita incorporar la complejidad de NgRx, que no se utiliza en este proyecto. RxJS sí se utiliza para las peticiones HTTP y flujos asíncronos, con operadores como `catchError`, `switchMap` y `finalize`.

* Arquitectura Standalone: Facilita el Lazy Loading nativo sin necesidad de declarar NgModules, optimizando el tiempo de carga inicial (bundle size).

* Diseño en CSS Puro: Se decidió no incluir librerías pesadas como Tailwind o Bootstrap para mantener el proyecto liviano, rápido en su build de producción y demostrar control total sobre el Maquetado CSS.

* Seguridad de peticiones: el interceptor solo añade `Authorization` al dominio de Fake Store API; además, la sesión se invalida cuando el JWT es inválido, está expirado o la API responde `401`.

* La aplicación valida la estructura y expiración del JWT para administrar la sesión del cliente; no verifica su firma criptográfica. La autenticidad y autorización real corresponden al servidor.

* La sesión se persiste en `localStorage` para cumplir la persistencia solicitada. En un entorno productivo se recomienda usar una cookie `HttpOnly`, `Secure` y con una política `SameSite` adecuada, gestionada por un backend, para reducir la exposición ante XSS.

* El botón de checkout muestra una confirmación de pedido simulado; no procesa pagos ni crea órdenes reales porque ese flujo está fuera del alcance de Fake Store API.

* Fake Store API no ofrece un endpoint real de registro, por lo que la aplicación implementa login y no simula un registro inexistente.

---

## 📄 Licencia

Este proyecto ha sido desarrollado únicamente con fines de evaluación para la **prueba técnica**. Todos los derechos reservados.