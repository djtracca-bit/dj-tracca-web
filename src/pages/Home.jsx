import { useState, useEffect } from 'react';
import { Star, Music, Calendar as CalendarIcon, Award } from 'lucide-react';
import Calendar from '../components/Calendar';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [homeData, setHomeData] = useState({
    biografia: 'DJ profesional con más de 10 años de experiencia en eventos de todo tipo. Especializado en música electrónica, house, techno y reggaeton. He pinchado en las mejores discotecas de la ciudad y eventos privados de alto nivel.',
    foto: '/placeholder-dj.jpg',
    reseñas: [
      {
        id: 1,
        nombre: 'María González',
        texto: '¡Increíble! La mejor música para nuestra boda. Todos nuestros invitados bailaron toda la noche.',
        rating: 5,
        evento: 'Boda'
      },
      {
        id: 2,
        nombre: 'Carlos Ruiz',
        texto: 'Profesional, puntual y con un set espectacular. Repetiremos seguro.',
        rating: 5,
        evento: 'Cumpleaños'
      },
      {
        id: 3,
        nombre: 'Laura Martínez',
        texto: 'Superó todas nuestras expectativas. Gran ambiente y música perfecta para nuestro evento corporativo.',
        rating: 5,
        evento: 'Evento Corporativo'
      }
    ]
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const docRef = doc(db, 'settings', 'home');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setHomeData(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeData.foto})`,
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dj-black/50 to-dj-black"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 animate-fadeInUp">
          <h1 className="text-6xl md:text-8xl font-display font-black mb-6">
            DJ <span className="text-dj-red">TRACCA</span>
          </h1>
          <p className="text-xl md:text-2xl text-dj-light-gray mb-8 max-w-2xl mx-auto">
            Música profesional para tus eventos más importantes
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#calendario" className="btn-primary">
              Reservar fecha
            </a>
            <a href="#biografia" className="btn-secondary">
              Conocer más
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dj-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeInUp">
              <div className="text-5xl font-display font-bold text-dj-red mb-2">10+</div>
              <div className="text-dj-light-gray">Años de experiencia</div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-display font-bold text-dj-red mb-2">500+</div>
              <div className="text-dj-light-gray">Eventos realizados</div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-display font-bold text-dj-red mb-2">100%</div>
              <div className="text-dj-light-gray">Clientes satisfechos</div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-display font-bold text-dj-red mb-2">24/7</div>
              <div className="text-dj-light-gray">Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Biografía Section */}
      <section id="biografia" className="py-20 bg-dj-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 flex items-center justify-center gap-3">
              <Music className="text-dj-red" size={40} />
              Sobre mí
            </h2>
          </div>
          
          <div className="bg-dj-gray rounded-2xl p-8 md:p-12 hover-lift">
            <p className="text-lg leading-relaxed text-dj-light-gray whitespace-pre-line">
              {homeData.biografia}
            </p>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Award className="text-dj-red flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold mb-1">Experiencia</h4>
                  <p className="text-sm text-dj-light-gray">Más de 10 años en la industria</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Music className="text-dj-red flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold mb-1">Estilos</h4>
                  <p className="text-sm text-dj-light-gray">House, Techno, Reggaeton, Comercial</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-dj-red flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold mb-1">Eventos</h4>
                  <p className="text-sm text-dj-light-gray">Bodas, Corporativos, Discotecas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseñas Section */}
      <section className="py-20 bg-dj-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Lo que dicen mis clientes
            </h2>
            <p className="text-dj-light-gray">Experiencias reales de eventos inolvidables</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {homeData.reseñas.map((reseña, index) => (
              <div 
                key={reseña.id}
                className="card hover-lift animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(reseña.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-dj-red text-dj-red" />
                  ))}
                </div>
                <p className="text-dj-light-gray mb-4 italic">"{reseña.texto}"</p>
                <div className="border-t border-dj-light-gray/20 pt-4">
                  <p className="font-semibold">{reseña.nombre}</p>
                  <p className="text-sm text-dj-light-gray">{reseña.evento}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendario Section */}
      <section id="calendario" className="py-20 bg-dj-black">
        <Calendar />
      </section>
    </div>
  );
};

export default Home;
