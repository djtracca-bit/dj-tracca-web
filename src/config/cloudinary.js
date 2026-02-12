// Configuración de Cloudinary (servicio gratuito para subir imágenes)
// Regístrate en https://cloudinary.com/ (GRATIS - 25GB storage)

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dbis77pxe',    // Lo obtienes al registrarte
  UPLOAD_PRESET: 'djtraccaweb'       // Crear en Settings > Upload > Upload presets
};

// URL de subida
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`;

// Función para subir imagen
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url
    };
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return {
      success: false,
      error
    };
  }
};

// Función para subir archivo (ZIP para PAX)
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('resource_type', 'raw'); // Para archivos que no son imágenes

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      filename: data.original_filename,
      size: `${(data.bytes / 1024 / 1024).toFixed(2)} MB`
    };
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return {
      success: false,
      error
    };
  }
};
