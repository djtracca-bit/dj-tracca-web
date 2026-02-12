# 🆓 GUÍA 100% GRATUITA - DJ TRACCA WEB

## ✅ TODO ES GRATIS - SIN TARJETA DE CRÉDITO

Esta guía usa **SOLO servicios gratuitos**:
- ✅ Firebase (plan gratuito - Firestore + Auth)
- ✅ Cloudinary (plan gratuito - 25GB para imágenes y archivos)
- ✅ EmailJS (plan gratuito - 200 emails/mes)
- ✅ Netlify (plan gratuito - hosting)

---

## 📋 PASO 1: Configurar Firebase (5 minutos)

### 1.1 Crear proyecto Firebase

1. Ve a https://console.firebase.google.com
2. Click en "Crear un proyecto" o "Agregar proyecto"
3. Nombre: **DJ Tracca**
4. Desactiva Google Analytics (no lo necesitas)
5. Click "Crear proyecto"
6. Espera 30 segundos
7. Click "Continuar"

### 1.2 Activar Firestore Database

1. En el menú lateral → **Firestore Database**
2. Click "Crear base de datos"
3. Modo: **Producción**
4. Ubicación: **europe-west3** (Frankfurt - el más cercano a España)
5. Habilitar
6. Ve a la pestaña **"Reglas"**
7. Pega este código:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera puede leer
    match /{document=**} {
      allow read: if true;
    }
    
    // Solo admin puede escribir/modificar/eliminar
    match /{document=**} {
      allow write: if request.auth != null;
    }
    
    // Excepción: cualquiera puede crear reservas
    match /reservations/{reservation} {
      allow create: if true;
    }
  }
}
```

8. Click "Publicar"

### 1.3 Activar Authentication

1. En el menú lateral → **Authentication**
2. Click "Comenzar"
3. Click en "Correo electrónico/contraseña"
4. **Activar** la primera opción (Email/Password)
5. NO actives "Vínculo de correo electrónico"
6. Guardar

### 1.4 Obtener configuración de Firebase

1. Click en el icono de engranaje ⚙️ (arriba a la izquierda)
2. "Configuración del proyecto"
3. Scroll down hasta **"Tus aplicaciones"**
4. Click en el icono **</>** (web)
5. Apodo de la app: **DJ Tracca Web**
6. NO marcar "También configurar Firebase Hosting"
7. Click "Registrar app"
8. **COPIA** el código que empieza con `const firebaseConfig = {`

Debería verse así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "dj-tracca-xxx.firebaseapp.com",
  projectId: "dj-tracca-xxx",
  storageBucket: "dj-tracca-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

9. Abre el archivo **`src/config/firebase.js`** del proyecto
10. Reemplaza el objeto `firebaseConfig` con el tuyo
11. Guarda el archivo

### 1.5 Crear usuario Admin

1. En Firebase Console → **Authentication** → **Users**
2. Click "Agregar usuario"
3. Email: **tu-email@gmail.com**
4. Contraseña: **tu-contraseña-segura** (mínimo 6 caracteres)
5. Click "Agregar usuario"
6. ⚠️ **MUY IMPORTANTE**: Click en el usuario que acabas de crear
7. En la sección "Email verificado" → Click en **"Marcar como verificado"**
8. Listo ✅

---

## 📧 PASO 2: Configurar EmailJS (3 minutos)

### 2.1 Crear cuenta en EmailJS

1. Ve a https://www.emailjs.com
2. Click "Sign Up" (registrarse)
3. Usa tu email de Gmail
4. Confirma tu email
5. Login

### 2.2 Conectar tu Gmail

1. En el dashboard → **Email Services**
2. Click "Add New Service"
3. Selecciona **Gmail**
4. Click "Connect Account"
5. Selecciona tu cuenta de Gmail
6. Permite los permisos
7. Service ID: déjalo como está (copia este ID para después)
8. Click "Create Service"

### 2.3 Crear plantilla de email

1. En el menú → **Email Templates**
2. Click "Create New Template"
3. **Borra todo** el contenido que aparece
4. Pega esto:

```
Nueva Reserva - DJ Tracca

De: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}

Fecha del evento: {{date}}
Tipo de evento: {{event_type}}
Presupuesto: {{budget}}

---
Accede al panel admin para gestionar esta reserva:
https://tu-sitio.netlify.app/admin
```

5. Settings:
   - Template Name: **Reserva DJ**
   - Subject: **Nueva reserva - {{from_name}}**
   - To email: **djtracca@gmail.com** (o tu email)
6. Copia el **Template ID** (aparece arriba)
7. Click "Save"

### 2.4 Obtener Public Key

1. En el menú → **Account**
2. Copia tu **Public Key** (son 20 caracteres aprox)

### 2.5 Configurar en el proyecto

1. Abre **`src/config/emailjs.js`**
2. Reemplaza:
   - `TU_SERVICE_ID` → el Service ID de Gmail (paso 2.2)
   - `TU_TEMPLATE_ID` → el Template ID (paso 2.3)
   - `TU_PUBLIC_KEY` → tu Public Key (paso 2.4)
3. Guarda el archivo

---

## 📷 PASO 3: Configurar Cloudinary (3 minutos)

### 3.1 Crear cuenta en Cloudinary

1. Ve a https://cloudinary.com/users/register/free
2. Regístrate con tu email
3. Confirma tu email
4. Login

### 3.2 Obtener Cloud Name

1. En el dashboard verás: **Cloud name: xxxxxxx**
2. Copia ese nombre

### 3.3 Crear Upload Preset

1. En el menú → **Settings** (icono engranaje)
2. Click en **Upload** (en el menú lateral)
3. Scroll down hasta **Upload presets**
4. Click "Add upload preset"
5. Configuración:
   - **Signing Mode**: Unsigned
   - **Upload preset name**: djtraccaweb
   - **Folder**: dj-tracca (opcional)
6. Click "Save"
7. **Copia el nombre del preset** (djtraccaweb)

### 3.4 Configurar en el proyecto

1. Abre **`src/config/cloudinary.js`**
2. Reemplaza:
   - `TU_CLOUD_NAME` → tu Cloud Name (paso 3.2)
   - `TU_PRESET` → tu Upload Preset (djtraccaweb del paso 3.3)
3. Guarda el archivo

---

## 💻 PASO 4: Instalar y Ejecutar (2 minutos)

### 4.1 Requisitos previos

1. Descarga e instala **Node.js**: https://nodejs.org (versión LTS)
2. Reinicia tu computadora después de instalar

### 4.2 Instalar dependencias

1. Abre la terminal en la carpeta del proyecto
2. Ejecuta:

```bash
npm install
```

Espera 1-2 minutos mientras se descargan las dependencias.

### 4.3 Ejecutar en local

```bash
npm run dev
```

Se abrirá automáticamente en: http://localhost:5173

🎉 **¡Tu web ya funciona localmente!**

Prueba:
1. Ve a http://localhost:5173
2. Haz una reserva en el calendario
3. Deberías recibir un email en tu Gmail
4. Ve a http://localhost:5173/admin
5. Login con tu email y contraseña de Firebase
6. Verás la reserva en el panel admin

---

## 🌐 PASO 5: Desplegar en Internet GRATIS (5 minutos)

### 5.1 Crear repositorio en GitHub

1. Ve a https://github.com
2. Regístrate (gratis)
3. Click "New repository" (botón verde)
4. Repository name: **dj-tracca-web**
5. Public
6. NO marques nada más
7. Click "Create repository"

### 5.2 Subir código a GitHub

En la terminal del proyecto:

```bash
git init
git add .
git commit -m "Versión inicial DJ Tracca"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dj-tracca-web.git
git push -u origin main
```

(Reemplaza TU-USUARIO con tu usuario de GitHub)

Si te pide usuario y contraseña:
- Usuario: tu username de GitHub
- Contraseña: genera un **Personal Access Token** en GitHub Settings > Developer settings > Personal access tokens > Generate new token (classic)

### 5.3 Desplegar en Netlify

1. Ve a https://netlify.com
2. Click "Sign up" → **Continuar con GitHub**
3. Autoriza Netlify
4. Click "New site from Git"
5. Click "GitHub"
6. Busca y selecciona **dj-tracca-web**
7. Build settings (déjalos como están):
   - Build command: `npm run build`
   - Publish directory: `dist`
8. Click "Deploy site"
9. Espera 2-3 minutos

🎉 **¡Tu web está online!**

Tu URL será: **https://nombre-aleatorio.netlify.app**

### 5.4 Cambiar nombre del sitio (opcional)

1. En Netlify → Site settings
2. "Change site name"
3. Nombre: **dj-tracca** (o el que quieras)
4. Ahora será: **https://dj-tracca.netlify.app**

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Prueba 1: Página principal
- Ve a tu sitio en Netlify
- Deberías ver la página de DJ Tracca

### Prueba 2: Hacer una reserva
1. Scroll al calendario
2. Click en un día verde
3. Rellena el formulario
4. Enviar
5. Verifica tu email → deberías recibir la reserva

### Prueba 3: Panel Admin
1. Ve a https://tu-sitio.netlify.app/admin
2. Login con tu email y contraseña de Firebase
3. Deberías ver la reserva
4. Prueba subir una foto
5. Prueba añadir un DJ al blog

---

## 🎨 PERSONALIZAR

### Cambiar colores

Edita `tailwind.config.js`:

```javascript
colors: {
  'dj-red': '#E31E24',      // Tu color principal
  'dj-black': '#0A0A0A',    // Negro
  'dj-gray': '#2A2A2A',     // Gris oscuro
}
```

Después ejecuta:
```bash
npm run build
git add .
git commit -m "Cambio de colores"
git push
```

Netlify se actualizará automáticamente en 2 minutos.

---

## ❓ PROBLEMAS COMUNES

### "Email not verified"
→ Ve a Firebase Console → Authentication → Usuario → Marca "Email verificado"

### "No me llegan emails"
→ Verifica EmailJS:
1. Service ID correcto en `emailjs.js`
2. Template ID correcto
3. Public Key correcto
4. Gmail conectado en EmailJS

### "Error al subir imágenes"
→ Verifica Cloudinary:
1. Cloud Name correcto en `cloudinary.js`
2. Upload Preset correcto
3. Upload Preset configurado como "Unsigned"

### "La web no se actualiza"
→ En Netlify:
1. Deploys → Trigger deploy → Clear cache and deploy site
2. Espera 2 minutos

---

## 📊 LÍMITES GRATUITOS

- **Firebase Firestore**: 50.000 lecturas/día (más que suficiente)
- **EmailJS**: 200 emails/mes (6-7 emails/día)
- **Cloudinary**: 25GB storage + 25GB bandwidth/mes
- **Netlify**: 100GB bandwidth/mes + build ilimitados

Para un DJ empezando, estos límites son **MÁS QUE SUFICIENTES** para años.

---

## 🎉 ¡LISTO!

Tu web profesional de DJ está online, 100% GRATIS, sin tarjeta de crédito.

Funcionalidades completas:
✅ Calendario de reservas
✅ Emails automáticos
✅ Panel Admin completo
✅ Subida de fotos y archivos
✅ Blog de DJs
✅ Descargas PAX protegidas
✅ Responsive (móvil + desktop)

**¿Dudas? Revisa los pasos otra vez, todo está explicado paso a paso.**

🎧🔥 ¡Disfruta tu nueva web!
