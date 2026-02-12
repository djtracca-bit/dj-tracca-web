# 🚀 GUÍA RÁPIDA DE INICIO - DJ TRACCA WEB

## ⚡ Configuración Rápida (15 minutos)

### PASO 1: Instalar Node.js
1. Descarga Node.js desde: https://nodejs.org (versión LTS)
2. Instala y reinicia tu computadora

### PASO 2: Configurar Firebase (GRATIS)

1. **Crear proyecto**:
   - Ve a https://console.firebase.google.com
   - "Crear proyecto" → Nombre: "DJ Tracca"
   - Desactiva Google Analytics (opcional)
   - Crear proyecto

2. **Activar servicios** (en el menú lateral):
   
   **a) Firestore Database**:
   - Click en "Firestore Database"
   - "Crear base de datos"
   - Modo: **Producción**
   - Ubicación: europe-west (más cercano)
   - Crear
   - Ve a pestaña "Reglas" y pega esto:
   
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /reservations/{reservation} {
         allow create: if true;
       }
     }
   }
   ```
   
   **b) Authentication**:
   - Click en "Authentication"
   - "Comenzar"
   - Habilitar "Correo electrónico/contraseña"
   - Guardar
   
   **c) Storage**:
   - Click en "Storage"
   - "Comenzar"
   - Modo producción
   - Ubicación: europe-west
   - Ve a pestaña "Reglas" y pega:
   
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Obtener configuración**:
   - Click en el icono de engranaje ⚙️ → "Configuración del proyecto"
   - Scroll down hasta "Tus aplicaciones"
   - Click en el icono web (</>)
   - Apodo: "DJ Tracca Web"
   - NO marcar Firebase Hosting
   - "Registrar app"
   - COPIA el código que empieza con `const firebaseConfig = {`

4. **Pegar en el proyecto**:
   - Abre `src/config/firebase.js`
   - Reemplaza el objeto firebaseConfig con el tuyo
   - Guarda el archivo

### PASO 3: Crear Usuario Admin

1. En Firebase Console → Authentication → Users
2. "Agregar usuario"
3. Email: **tu-email@gmail.com**
4. Contraseña: **tu-contraseña-segura** (mínimo 6 caracteres)
5. Agregar usuario
6. ⚠️ IMPORTANTE: Click en el usuario → Marca "Email verificado" ✓

### PASO 4: Instalar y Ejecutar

1. Abre la terminal en la carpeta del proyecto
2. Ejecuta:

```bash
npm install
npm run dev
```

3. Abre el navegador en: http://localhost:3000

¡LISTO! La web ya funciona en local 🎉

---

## 🌐 DESPLEGAR EN INTERNET (GRATIS CON NETLIFY)

### PASO 1: Crear cuenta GitHub

1. Ve a https://github.com
2. Crear cuenta (gratis)
3. Crear repositorio nuevo: "dj-tracca-web"

### PASO 2: Subir código a GitHub

En la terminal del proyecto:

```bash
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dj-tracca-web.git
git push -u origin main
```

### PASO 3: Desplegar en Netlify

1. Ve a https://netlify.com
2. "Sign up" con GitHub
3. "New site from Git"
4. Conectar con GitHub → Autorizar
5. Seleccionar repositorio "dj-tracca-web"
6. Build settings (dejar por defecto):
   - Build command: `npm run build`
   - Publish directory: `dist`
7. "Deploy site"
8. ¡Espera 2-3 minutos!

Tu web estará en: **https://nombre-aleatorio.netlify.app**

### PASO 4: Configurar Emails

1. **Crear App Password de Gmail**:
   - Ve a tu cuenta Google → Seguridad
   - Activa "Verificación en 2 pasos"
   - "Contraseñas de aplicaciones" → Generar
   - App: Correo, Dispositivo: Otro → "Netlify"
   - COPIA la contraseña de 16 caracteres

2. **Añadir en Netlify**:
   - En tu sitio Netlify → Site settings
   - "Environment variables" → "Add a variable"
   - Variable 1:
     - Key: `EMAIL_USER`
     - Value: `djtracca@gmail.com`
   - Variable 2:
     - Key: `EMAIL_PASSWORD`
     - Value: `la-contraseña-de-16-caracteres`
   - Guardar
   - "Trigger deploy" → "Clear cache and deploy site"

---

## 🎯 CÓMO USAR EL PANEL ADMIN

### Acceder:
1. Ve a: `https://tu-sitio.netlify.app/admin`
2. Login con el email y contraseña de Firebase
3. Listo, estás dentro 🎉

### Editar contenido:

**Pestaña "Inicio"**:
- Sube tu foto de DJ
- Edita tu biografía
- Guardar cambios

**Pestaña "Calendario"**:
- Ver reservas recibidas
- Marcar días como "Ocupado" (rojo)
- Liberar fechas

**Pestaña "Blog DJs"**:
- Añadir DJs invitados
- Subir foto, biografía, links de SoundCloud
- Editar o eliminar

**Pestaña "PAX"**:
- Subir archivos ZIP
- Crear contraseñas para cada archivo
- Ver quién descarga

**Pestaña "Ajustes"**:
- Configurar links de Instagram, Facebook, etc.

---

## ❓ PREGUNTAS FRECUENTES

### ¿Es gratis?
Sí, 100% gratis con:
- Firebase: Plan gratuito (Spark)
- Netlify: Plan gratuito
- Límites: más que suficiente para empezar

### ¿Necesito dominio propio?
No, Netlify te da uno gratis (.netlify.app)
Si quieres uno personalizado (.com), puedes comprarlo después

### ¿Cuántas reservas soporta?
Ilimitadas en Firebase (plan gratuito: 50K lecturas/día)

### ¿Cómo cambio los colores?
Edita `tailwind.config.js` y cambia los valores de `dj-red`, etc.

### No me llegan los emails
- Verifica las variables de entorno en Netlify
- Verifica la App Password de Gmail
- Revisa la carpeta de SPAM

### ¿Puedo usar otro email que no sea Gmail?
Sí, pero necesitas configurar SMTP. Gmail es lo más fácil.

---

## 📞 SOPORTE

¿Problemas? Revisa:
1. README.md completo
2. Logs de Netlify: Site → Functions → Logs
3. Consola de Firebase: Functions → Logs
4. Consola del navegador (F12)

---

¡Disfruta tu nueva web! 🎧🔥
