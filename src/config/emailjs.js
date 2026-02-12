// Configuración de EmailJS (servicio gratuito para enviar emails)
// Regístrate en https://www.emailjs.com/ (GRATIS - 200 emails/mes)

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_yepeglf',      // Lo obtienes al registrarte en EmailJS
  TEMPLATE_ID: 'template_s2mtg94',    // Crear template en EmailJS
  PUBLIC_KEY: '3H5uNLUH44IsXy3bB'      // Tu Public Key de EmailJS
};

// Función para enviar email de reserva
export const sendReservationEmail = async (reservationData) => {
  try {
    // Cargar EmailJS desde CDN
    if (!window.emailjs) {
      await loadEmailJS();
    }

    const templateParams = {
      to_email: 'djtracca@gmail.com',
      from_name: reservationData.nombre,
      from_email: reservationData.email,
      phone: reservationData.telefono,
      event_type: reservationData.tipoFiesta,
      budget: reservationData.presupuesto,
      date: new Date(reservationData.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      message: `Nueva reserva recibida para el ${new Date(reservationData.fecha).toLocaleDateString('es-ES')}`
    };

    const response = await window.emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email enviado:', response.status);
    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error };
  }
};

// Cargar EmailJS desde CDN
const loadEmailJS = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
