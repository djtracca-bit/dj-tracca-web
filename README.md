# 🎧 DJ Tracca - Sitio Web Profesional

Sitio web completo para DJ con sistema de reservas, blog de DJs, descargas protegidas y panel de administración.

## 🌟 Características

### ✅ Página Principal
- Hero section con foto personalizable
- Biografía editable desde Admin
- Sistema de reseñas
- Calendario de reservas interactivo
- Diseño responsive (móvil + desktop)

### ✅ Sistema de Reservas
- Calendario mensual interactivo
- Estados de días:
  - 🟢 **Verde**: Disponible
  - 🟡 **Amarillo**: Disponible según horario (reserva pendiente)
  - 🔴 **Rojo**: Reservado/Ocupado
- Formulario de reserva con validación
- Email automático al admin
- Base de datos real (sin caché)

### ✅ Página PAX
- Archivos ZIP protegidos con contraseña
- Cada archivo con su propia contraseña
- Sin límite de descargas
- Gestión completa desde Admin

### ✅ Blog de DJs
- Mini-entradas de DJs invitados
- Foto, biografía, redes sociales
- Reproductor de mezclas (SoundCloud/Mixcloud)
- Paginación (2 DJs por página)
- Gestión completa desde Admin

### ✅ Panel Admin
- Autenticación segura con 2FA (verificación de email)
- Editar todo el contenido sin tocar código:
  - Biografía y foto principal
  - Gestionar calendario (cambiar estado de días)
  - Aprobar/rechazar reservas
  - Añadir/editar DJs del blog
  - Subir archivos PAX con contraseñas
  - Configurar redes sociales

### ✅ Tecnologías
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore + Storage + Auth + Functions)
- **Hosting**: Netlify (frontend) + Firebase (backend)
- **Emails**: Netlify Functions + Nodemailer

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el proyecto

```bash
# Descargar el proyecto
cd dj-tracca-web

# Instalar dependencias
npm install
```

### 2️⃣ Configurar Firebase

1. **Crear proyecto en Firebase Console**:
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Crea un nuevo proyecto llamado "dj-tracca"
   - Activa Google Analytics (opcional)

2. **Activar servicios necesarios**:
   - **Firestore Database**: 
     - En el menú lateral → Firestore Database → Crear base de datos
     - Modo: Producción
   - **Authentication**:
     - En el menú lateral → Authentication → Comenzar
     - Habilitar "Email/Password"
   - **Storage**:
     - En el menú lateral → Storage → Comenzar
   - **Functions** (opcional para emails):
     - Se configurará después

3. **Obtener credenciales**:
   - En Configuración del proyecto (⚙️) → Tus aplicaciones
   - Añadir app web (icono </>) 
   - Copiar el objeto `firebaseConfig`

4. **Configurar en el proyecto**:
   - Abrir `src/config/firebase.js`
   - Reemplazar el objeto `firebaseConfig` con tus credenciales

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. **Configurar reglas de seguridad de Firestore**:

En Firebase Console → Firestore Database → Reglas, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reservations: cualquiera puede leer y crear, solo admin puede modificar
    match /reservations/{reservation} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    
    // Settings: cualquiera puede leer, solo admin puede escribir
    match /settings/{setting} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog DJs: cualquiera puede leer, solo admin puede escribir
    match /blogDJs/{dj} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // PAX Files: cualquiera puede leer, solo admin puede escribir
    match /paxFiles/{file} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

6. **Configurar reglas de Storage**:

En Firebase Console → Storage → Rules, pega esto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images: cualquiera puede leer, solo admin puede escribir
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // PAX files: cualquiera puede leer, solo admin puede escribir
    match /pax/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3️⃣ Crear usuario Admin

1. En Firebase Console → Authentication → Users → Add user
2. Email: `tu-email@gmail.com`
3. Password: `tu-password-seguro`
4. ⚠️ **IMPORTANTE**: Verificar el email manualmente:
   - Hacer clic en el usuario creado
   - Marcar como "Email verified"

### 4️⃣ Configurar emails (Netlify Functions)

1. **Crear App Password de Gmail**:
   - Ve a tu cuenta de Google → Seguridad
   - Activa "Verificación en 2 pasos"
   - En "Contraseñas de aplicaciones" → Generar nueva
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Copia la contraseña generada (16 caracteres)

2. **Configurar variables de entorno localmente**:
   - Crear archivo `.env` en la raíz:

```env
EMAIL_USER=djtracca@gmail.com
EMAIL_PASSWORD=tu-app-password-de-16-caracteres
```

3. **Instalar dependencias de Functions**:

```bash
npm install nodemailer
```

### 5️⃣ Ejecutar en local

```bash
# Desarrollo
npm run dev

# La app estará en http://localhost:3000
```

---

## 🌐 Desplegar en Netlify

### 1️⃣ Preparar el proyecto

```bash
# Build de producción (para probar)
npm run build
```

### 2️⃣ Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit - DJ Tracca Web"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dj-tracca-web.git
git push -u origin main
```

### 3️⃣ Desplegar en Netlify

1. **Crear cuenta en Netlify** (gratis): https://netlify.com
2. **Importar desde GitHub**:
   - New site from Git → GitHub
   - Autorizar y seleccionar el repositorio
   - Build settings (autodetectado):
     - Build command: `npm run build`
     - Publish directory: `dist`
3. **Configurar variables de entorno**:
   - Site settings → Environment variables → Add variable
   - Añadir:
     - `EMAIL_USER`: `djtracca@gmail.com`
     - `EMAIL_PASSWORD`: `tu-app-password-de-gmail`
4. **Deploy**: Se despliega automáticamente

### 4️⃣ Configurar dominio personalizado (opcional)

1. En Netlify → Domain settings → Add custom domain
2. Comprar dominio o usar uno existente
3. Configurar DNS según las instrucciones

---

## 📖 Uso del Panel Admin

### Acceder al Panel

1. Ve a `https://tu-sitio.netlify.app/admin`
2. Inicia sesión con el email y contraseña de Firebase
3. Si no has verificado el email, recibirás un mensaje

### Editar Página Principal

1. **Foto principal**:
   - Subir imagen (JPG/PNG, recomendado 1920x1080)
   - Se guarda automáticamente en Firebase Storage
   
2. **Biografía**:
   - Editar texto
   - Guardar cambios

### Gestionar Calendario

1. Ver todas las reservas recibidas
2. Cada reserva muestra:
   - Fecha, nombre, contacto, tipo de evento, presupuesto
3. Acciones disponibles:
   - **Marcar como Ocupado** → día se pone en rojo
   - **Liberar Fecha** → vuelve a verde

### Gestionar Blog de DJs

1. **Añadir DJ**:
   - Click en "Añadir DJ"
   - Rellenar: nombre, biografía, foto (URL), redes sociales
   - Mix URL: enlace de SoundCloud o Mixcloud
   - Guardar

2. **Editar/Eliminar**:
   - Cada DJ tiene botones de editar y eliminar

### Gestionar Archivos PAX

1. **Añadir archivo**:
   - Click en "Añadir Archivo"
   - Nombre, descripción
   - Contraseña (la que darás a los usuarios)
   - Subir archivo ZIP
   - Guardar

2. **Editar/Eliminar**:
   - Ver contraseña de cada archivo
   - Editar o eliminar

### Configurar Redes Sociales

1. Pestaña "Ajustes"
2. Añadir URLs de Instagram, Facebook, YouTube
3. Guardar configuración

---

## 🎨 Personalización de Colores

Los colores del branding están en `tailwind.config.js`:

```javascript
colors: {
  'dj-red': '#E31E24',      // Rojo principal
  'dj-black': '#0A0A0A',    // Negro
  'dj-gray': '#2A2A2A',     // Gris oscuro
  'dj-light-gray': '#6B6B6B', // Gris claro
}
```

Para cambiar colores:
1. Editar `tailwind.config.js`
2. Reconstruir: `npm run build`

---

## 🔒 Seguridad

### ✅ Implementado
- Autenticación con Firebase Auth
- Verificación de email (2FA)
- Reglas de seguridad en Firestore y Storage
- Contraseñas protegidas para descargas
- Variables de entorno para credenciales sensibles

### ⚠️ Recomendaciones
- **NUNCA** subir `.env` a Git
- Usar contraseñas fuertes para el Admin
- Revisar las reglas de Firestore regularmente
- Cambiar contraseñas de PAX periódicamente

---

## 📧 Cómo Funcionan los Emails

1. Usuario hace una reserva en el calendario
2. Datos se guardan en Firestore
3. Se llama a Netlify Function `sendEmail`
4. Function envía email a `djtracca@gmail.com` con:
   - Detalles de la reserva
   - Enlace directo al panel Admin
5. Día se marca como "amarillo" (pendiente)
6. Admin puede confirmar o rechazar desde el panel

---

## 🛠️ Solución de Problemas

### Error: "Firebase config no encontrado"
- Verificar que has actualizado `src/config/firebase.js` con tus credenciales

### Error: "Email no verificado"
- En Firebase Console → Authentication → Marcar email como verificado

### Error: "No se envían emails"
- Verificar variables de entorno en Netlify
- Verificar App Password de Gmail
- Revisar logs en Netlify Functions

### Error: "No se suben archivos"
- Verificar reglas de Storage en Firebase
- Verificar que estás autenticado como Admin

---

## 📱 Responsive Design

El sitio es completamente responsive:
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Todos los componentes se adaptan automáticamente.

---

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Integración con Google Calendar
- [ ] Pagos online (Stripe)
- [ ] Galería de fotos de eventos
- [ ] Sistema de valoraciones
- [ ] Chat en vivo con clientes
- [ ] Multi-idioma (Inglés)
- [ ] Newsletter

---

## 📞 Soporte

Si tienes problemas, contacta al desarrollador o revisa la documentación de:
- [Firebase Docs](https://firebase.google.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [React Docs](https://react.dev)

---

## 📄 Licencia

© 2025 DJ Tracca. Todos los derechos reservados.

---

¡Disfruta de tu nueva web profesional! 🎧🔥
#   d j - t r a c c a - w e b  
 #   d j - t r a c c a - w e b  
 #   d j - t r a c c a - w e b  
 #   d j - t r a c c a - w e b  
 