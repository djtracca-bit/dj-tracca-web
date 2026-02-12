import { useState, useEffect } from 'react';
import { Instagram, Music, ExternalLink } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Blog = () => {
  const [djs, setDjs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const djsPerPage = 2;

  useEffect(() => {
    loadDJs();
  }, []);

  const loadDJs = async () => {
    try {
      const q = query(collection(db, 'blogDJs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const djsData = [];
      
      querySnapshot.forEach((doc) => {
        djsData.push({ id: doc.id, ...doc.data() });
      });
      
      setDjs(djsData);
    } catch (error) {
      console.error('Error cargando DJs:', error);
    }
  };

  const totalPages = Math.ceil(djs.length / djsPerPage);
  const currentDJs = djs.slice(
    currentPage * djsPerPage,
    (currentPage + 1) * djsPerPage
  );

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Blog <span className="text-dj-red">DJs</span>
          </h1>
          <p className="text-xl text-dj-light-gray">
            Descubre DJs talentosos y sus mejores mezclas
          </p>
        </div>

        {/* DJs Grid */}
        {djs.length === 0 ? (
          <div className="text-center py-20">
            <Music className="mx-auto mb-4 text-dj-light-gray" size={64} />
            <p className="text-dj-light-gray text-xl">
              Próximamente DJs destacados...
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {currentDJs.map((dj, index) => (
                <div
                  key={dj.id}
                  className="card hover-lift animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* DJ Photo */}
                  <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                    <img
                      src={dj.photo || '/placeholder-dj.jpg'}
                      alt={dj.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dj-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-3xl font-display font-bold">{dj.name}</h3>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Biografía</h4>
                    <p className="text-dj-light-gray leading-relaxed">
                      {dj.biography}
                    </p>
                  </div>

                  {/* Music Mix */}
                  {dj.mixUrl && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Music size={20} className="text-dj-red" />
                        Mix destacado
                      </h4>
                      
                      {dj.mixUrl.includes('soundcloud.com') ? (
                        <iframe
                          width="100%"
                          height="166"
                          scrolling="no"
                          frameBorder="no"
                          src={`https://w.soundcloud.com/player/?url=${dj.mixUrl}&color=%23E31E24&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                        ></iframe>
                      ) : dj.mixUrl.includes('mixcloud.com') ? (
                        <iframe
                          width="100%"
                          height="120"
                          src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${dj.mixUrl}`}
                          frameBorder="0"
                        ></iframe>
                      ) : (
                        <audio controls className="w-full">
                          <source src={dj.mixUrl} type="audio/mpeg" />
                          Tu navegador no soporta audio HTML5.
                        </audio>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3 pt-4 border-t border-dj-light-gray/20">
                    {dj.instagram && (
                      <a
                        href={dj.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-dj-black rounded-lg hover:bg-dj-red transition-colors"
                      >
                        <Instagram size={20} />
                        Instagram
                      </a>
                    )}
                    {dj.soundcloud && (
                      <a
                        href={dj.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-dj-black rounded-lg hover:bg-dj-red transition-colors"
                      >
                        <ExternalLink size={20} />
                        SoundCloud
                      </a>
                    )}
                    {dj.website && (
                      <a
                        href={dj.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-dj-black rounded-lg hover:bg-dj-red transition-colors"
                      >
                        <ExternalLink size={20} />
                        Web
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="btn-secondary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === i
                          ? 'bg-dj-red text-white'
                          : 'bg-dj-gray text-white hover:bg-dj-red/50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="btn-secondary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
