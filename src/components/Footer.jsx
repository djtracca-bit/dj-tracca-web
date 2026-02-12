import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  // Estas URLs se podrán editar desde el panel Admin
  const socialLinks = {
    instagram: 'https://instagram.com/djtracca',
    facebook: 'https://facebook.com/djtracca',
    youtube: 'https://youtube.com/@djtracca',
    email: 'mailto:djtracca@gmail.com'
  };

  return (
    <footer className="bg-dj-black border-t border-dj-red/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              DJ <span className="text-dj-red">TRACCA</span>
            </h3>
            <p className="text-dj-light-gray">
              DJ profesional para tus eventos. Música de calidad y experiencia inolvidable.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#biografia" className="text-dj-light-gray hover:text-dj-red transition-colors">
                  Biografía
                </a>
              </li>
              <li>
                <a href="#calendario" className="text-dj-light-gray hover:text-dj-red transition-colors">
                  Reservar fecha
                </a>
              </li>
              <li>
                <a href="/blog" className="text-dj-light-gray hover:text-dj-red transition-colors">
                  Blog DJs
                </a>
              </li>
              <li>
                <a href="/pax" className="text-dj-light-gray hover:text-dj-red transition-colors">
                  Descargas PAX
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Sígueme</h4>
            <div className="flex gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dj-gray rounded-lg flex items-center justify-center hover:bg-dj-red transition-all transform hover:scale-110"
              >
                <Instagram size={24} />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dj-gray rounded-lg flex items-center justify-center hover:bg-dj-red transition-all transform hover:scale-110"
              >
                <Facebook size={24} />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dj-gray rounded-lg flex items-center justify-center hover:bg-dj-red transition-all transform hover:scale-110"
              >
                <Youtube size={24} />
              </a>
              <a
                href={socialLinks.email}
                className="w-12 h-12 bg-dj-gray rounded-lg flex items-center justify-center hover:bg-dj-red transition-all transform hover:scale-110"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dj-gray mt-8 pt-8 text-center text-dj-light-gray">
          <p>&copy; {new Date().getFullYear()} DJ Tracca. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
