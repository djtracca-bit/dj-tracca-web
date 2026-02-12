import { useState, useEffect } from 'react';
import { Download, Lock, Unlock, File } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PAX = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'paxFiles'));
      const filesData = [];
      
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() });
      });
      
      setFiles(filesData);
    } catch (error) {
      console.error('Error cargando archivos:', error);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar contraseña
      if (password !== selectedFile.password) {
        setError('Contraseña incorrecta');
        setLoading(false);
        return;
      }

      // Descargar archivo directamente desde Cloudinary
      const link = document.createElement('a');
      link.href = selectedFile.storagePath;
      link.download = selectedFile.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Resetear
      setPassword('');
      setSelectedFile(null);
      alert('¡Descarga iniciada!');
    } catch (error) {
      console.error('Error descargando archivo:', error);
      setError('Error al descargar el archivo. Contacta con el administrador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            PAX <span className="text-dj-red">Downloads</span>
          </h1>
          <p className="text-xl text-dj-light-gray">
            Archivos exclusivos protegidos con contraseña
          </p>
        </div>

        {/* Info box */}
        <div className="bg-dj-gray rounded-xl p-6 mb-12 border border-dj-red/30">
          <div className="flex items-start gap-3">
            <Lock className="text-dj-red flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold mb-2">Acceso restringido</h3>
              <p className="text-dj-light-gray text-sm">
                Estos archivos están protegidos con contraseña. Si no tienes la contraseña, 
                contacta con el administrador para obtener acceso.
              </p>
            </div>
          </div>
        </div>

        {/* Files list */}
        {files.length === 0 ? (
          <div className="text-center py-20">
            <File className="mx-auto mb-4 text-dj-light-gray" size={64} />
            <p className="text-dj-light-gray text-xl">
              No hay archivos disponibles en este momento
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="card hover-lift animate-fadeInUp cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                    <p className="text-dj-light-gray text-sm mb-4">{file.description}</p>
                    <div className="flex items-center gap-2 text-sm text-dj-light-gray">
                      <File size={16} />
                      <span>{file.size || 'Archivo ZIP'}</span>
                    </div>
                  </div>
                  <Lock className="text-dj-red" size={24} />
                </div>
                <button className="btn-primary w-full mt-4">
                  <Download size={20} className="inline mr-2" />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Password Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-dj-gray rounded-xl p-8 max-w-md w-full animate-fadeInUp">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-dj-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Unlock className="text-dj-red" size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">
                  {selectedFile.name}
                </h3>
                <p className="text-dj-light-gray text-sm">
                  Introduce la contraseña para descargar
                </p>
              </div>

              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full"
                    placeholder="Introduce la contraseña"
                    required
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPassword('');
                      setError('');
                    }}
                    className="btn-secondary flex-1"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner w-5 h-5"></div>
                    ) : (
                      <>
                        <Download size={20} />
                        Descargar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PAX;
