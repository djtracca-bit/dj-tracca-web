import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  updateDoc,
  query,
  where 
} from 'firebase/firestore';
import { uploadImage, uploadFile } from '../config/cloudinary';
import { 
  LogOut, 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  FileText, 
  Users, 
  Settings as SettingsIcon,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Admin panel state
  const [activeTab, setActiveTab] = useState('home');
  const [saving, setSaving] = useState(false);
  
  // Home data
  const [homeData, setHomeData] = useState({
    biografia: '',
    foto: ''
  });
  
  // Reservations
  const [reservations, setReservations] = useState([]);
  
  // Blog DJs
  const [djs, setDjs] = useState([]);
  const [editingDJ, setEditingDJ] = useState(null);
  
  // PAX files
  const [paxFiles, setPaxFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);

  // Settings
  const [settings, setSettings] = useState({
    socialLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
      email: 'djtracca@gmail.com'
    }
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        loadAdminData();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadAdminData = async () => {
    try {
      // Cargar datos de Home
      const homeDoc = await getDoc(doc(db, 'settings', 'home'));
      if (homeDoc.exists()) {
        setHomeData(homeDoc.data());
      }

      // Cargar reservas
      const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
      const reservationsData = [];
      reservationsSnapshot.forEach((doc) => {
        reservationsData.push({ id: doc.id, ...doc.data() });
      });
      setReservations(reservationsData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ));

      // Cargar DJs del blog
      const djsSnapshot = await getDocs(collection(db, 'blogDJs'));
      const djsData = [];
      djsSnapshot.forEach((doc) => {
        djsData.push({ id: doc.id, ...doc.data() });
      });
      setDjs(djsData);

      // Cargar archivos PAX
      const paxSnapshot = await getDocs(collection(db, 'paxFiles'));
      const paxData = [];
      paxSnapshot.forEach((doc) => {
        paxData.push({ id: doc.id, ...doc.data() });
      });
      setPaxFiles(paxData);

      // Cargar configuración
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      console.error('Error cargando datos admin:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar 2FA (email verification)
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setLoginError('Por favor, verifica tu email. Te hemos enviado un enlace de verificación.');
        await signOut(auth);
        setLoading(false);
        return;
      }

      // Login exitoso
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error login:', error);
      setLoginError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  const saveHomeData = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'home'), homeData);
      alert('Datos guardados correctamente');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      // Subir a Cloudinary (GRATIS)
      const result = await uploadImage(file);
      
      if (!result.success) {
        throw new Error('Error al subir imagen');
      }
      
      setHomeData({ ...homeData, foto: result.url });
      await setDoc(doc(db, 'settings', 'home'), { ...homeData, foto: result.url });
      
      alert('Foto subida correctamente');
    } catch (error) {
      console.error('Error subiendo foto:', error);
      alert('Error al subir la foto');
    } finally {
      setSaving(false);
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { status });
      loadAdminData();
      alert('Estado actualizado');
    } catch (error) {
      console.error('Error actualizando:', error);
    }
  };

  const saveDJ = async (djData) => {
    setSaving(true);
    try {
      if (djData.id) {
        await updateDoc(doc(db, 'blogDJs', djData.id), djData);
      } else {
        await setDoc(doc(collection(db, 'blogDJs')), {
          ...djData,
          createdAt: new Date().toISOString()
        });
      }
      
      setEditingDJ(null);
      loadAdminData();
      alert('DJ guardado correctamente');
    } catch (error) {
      console.error('Error guardando DJ:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const deleteDJ = async (id) => {
    if (!confirm('¿Eliminar este DJ?')) return;
    
    try {
      await deleteDoc(doc(db, 'blogDJs', id));
      loadAdminData();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const savePAXFile = async (fileData) => {
    setSaving(true);
    try {
      if (fileData.id) {
        await updateDoc(doc(db, 'paxFiles', fileData.id), fileData);
      } else {
        await setDoc(doc(collection(db, 'paxFiles')), {
          ...fileData,
          createdAt: new Date().toISOString()
        });
      }
      
      setEditingFile(null);
      loadAdminData();
      alert('Archivo guardado correctamente');
    } catch (error) {
      console.error('Error guardando archivo:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      // Subir a Cloudinary (GRATIS)
      const result = await uploadFile(file);
      
      if (!result.success) {
        throw new Error('Error al subir archivo');
      }
      
      setEditingFile({
        ...editingFile,
        storagePath: result.url,
        filename: result.filename || file.name,
        size: result.size || `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
      
      alert('Archivo subido correctamente');
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      alert('Error al subir el archivo');
    } finally {
      setSaving(false);
    }
  };

  const deletePAXFile = async (id) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    
    try {
      await deleteDoc(doc(db, 'paxFiles', id));
      loadAdminData();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      alert('Configuración guardada');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-dj-gray rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Panel Admin</h2>
            <p className="text-dj-light-gray">Acceso restringido</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dj-light-gray hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-xs text-dj-light-gray text-center mt-6">
            Protegido con autenticación de dos factores (2FA)
          </p>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Panel de Administración</h1>
            <p className="text-dj-light-gray">Bienvenido, {user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-dj-gray rounded-xl p-2 mb-8 flex gap-2 overflow-x-auto">
          {[
            { id: 'home', label: 'Inicio', icon: HomeIcon },
            { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
            { id: 'blog', label: 'Blog DJs', icon: Users },
            { id: 'pax', label: 'PAX', icon: FileText },
            { id: 'settings', label: 'Ajustes', icon: SettingsIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-dj-red text-white'
                  : 'text-dj-light-gray hover:text-white hover:bg-dj-black'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-dj-gray rounded-xl p-8">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold mb-6">Editar Página Principal</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Foto Principal</label>
                {homeData.foto && (
                  <img src={homeData.foto} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Biografía</label>
                <textarea
                  value={homeData.biografia}
                  onChange={(e) => setHomeData({ ...homeData, biografia: e.target.value })}
                  rows={10}
                  className="w-full"
                  placeholder="Escribe tu biografía..."
                />
              </div>

              <button
                onClick={saveHomeData}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Gestionar Reservas</h2>
              
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="bg-dj-black rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{res.nombre}</h3>
                        <p className="text-dj-light-gray">
                          {new Date(res.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        res.status === 'pendiente' ? 'bg-yellow-500' :
                        res.status === 'ocupado' ? 'bg-red-600' : 'bg-green-600'
                      }`}>
                        {res.status === 'pendiente' ? 'Pendiente' :
                         res.status === 'ocupado' ? 'Ocupado' : 'Disponible'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div><strong>Teléfono:</strong> {res.telefono}</div>
                      <div><strong>Email:</strong> {res.email}</div>
                      <div><strong>Tipo:</strong> {res.tipoFiesta}</div>
                      <div><strong>Presupuesto:</strong> {res.presupuesto}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateReservationStatus(res.id, 'ocupado')}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Marcar como Ocupado
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'disponible')}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Liberar Fecha
                      </button>
                    </div>
                  </div>
                ))}

                {reservations.length === 0 && (
                  <p className="text-center text-dj-light-gray py-12">No hay reservas pendientes</p>
                )}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Blog de DJs</h2>
                <button
                  onClick={() => setEditingDJ({
                    name: '',
                    biography: '',
                    photo: '',
                    instagram: '',
                    soundcloud: '',
                    website: '',
                    mixUrl: ''
                  })}
                  className="btn-primary"
                >
                  Añadir DJ
                </button>
              </div>

              {editingDJ && (
                <div className="bg-dj-black rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {editingDJ.id ? 'Editar DJ' : 'Nuevo DJ'}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre del DJ"
                      value={editingDJ.name}
                      onChange={(e) => setEditingDJ({ ...editingDJ, name: e.target.value })}
                      className="w-full"
                    />
                    
                    <textarea
                      placeholder="Biografía"
                      value={editingDJ.biography}
                      onChange={(e) => setEditingDJ({ ...editingDJ, biography: e.target.value })}
                      rows={4}
                      className="w-full"
                    />
                    
                    <input
                      type="url"
                      placeholder="URL de la foto"
                      value={editingDJ.photo}
                      onChange={(e) => setEditingDJ({ ...editingDJ, photo: e.target.value })}
                      className="w-full"
                    />
                    
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={editingDJ.instagram}
                      onChange={(e) => setEditingDJ({ ...editingDJ, instagram: e.target.value })}
                      className="w-full"
                    />
                    
                    <input
                      type="url"
                      placeholder="SoundCloud URL"
                      value={editingDJ.soundcloud}
                      onChange={(e) => setEditingDJ({ ...editingDJ, soundcloud: e.target.value })}
                      className="w-full"
                    />
                    
                    <input
                      type="url"
                      placeholder="Mix URL (SoundCloud/Mixcloud)"
                      value={editingDJ.mixUrl}
                      onChange={(e) => setEditingDJ({ ...editingDJ, mixUrl: e.target.value })}
                      className="w-full"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveDJ(editingDJ)}
                        className="btn-primary"
                        disabled={saving}
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditingDJ(null)}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {djs.map((dj) => (
                  <div key={dj.id} className="bg-dj-black rounded-lg p-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{dj.name}</h3>
                      <p className="text-dj-light-gray text-sm line-clamp-2">{dj.biography}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDJ(dj)}
                        className="p-2 hover:bg-dj-gray rounded-lg"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteDJ(dj.id)}
                        className="p-2 hover:bg-red-600 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAX TAB */}
          {activeTab === 'pax' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Archivos PAX</h2>
                <button
                  onClick={() => setEditingFile({
                    name: '',
                    description: '',
                    password: '',
                    storagePath: '',
                    filename: ''
                  })}
                  className="btn-primary"
                >
                  Añadir Archivo
                </button>
              </div>

              {editingFile && (
                <div className="bg-dj-black rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {editingFile.id ? 'Editar Archivo' : 'Nuevo Archivo'}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre del archivo"
                      value={editingFile.name}
                      onChange={(e) => setEditingFile({ ...editingFile, name: e.target.value })}
                      className="w-full"
                    />
                    
                    <textarea
                      placeholder="Descripción"
                      value={editingFile.description}
                      onChange={(e) => setEditingFile({ ...editingFile, description: e.target.value })}
                      rows={3}
                      className="w-full"
                    />
                    
                    <input
                      type="password"
                      placeholder="Contraseña para descargar"
                      value={editingFile.password}
                      onChange={(e) => setEditingFile({ ...editingFile, password: e.target.value })}
                      className="w-full"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subir archivo ZIP</label>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileUpload}
                        className="w-full"
                      />
                      {editingFile.filename && (
                        <p className="text-sm text-dj-light-gray mt-2">
                          Archivo: {editingFile.filename} ({editingFile.size})
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => savePAXFile(editingFile)}
                        className="btn-primary"
                        disabled={saving}
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditingFile(null)}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {paxFiles.map((file) => (
                  <div key={file.id} className="bg-dj-black rounded-lg p-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                      <p className="text-dj-light-gray text-sm mb-2">{file.description}</p>
                      <p className="text-xs text-dj-light-gray">
                        Contraseña: {file.password} | Archivo: {file.filename}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingFile(file)}
                        className="p-2 hover:bg-dj-gray rounded-lg"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deletePAXFile(file.id)}
                        className="p-2 hover:bg-red-600 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Configuración General</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
                  <div className="space-y-4">
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={settings.socialLinks?.instagram || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full"
                    />
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      value={settings.socialLinks?.facebook || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full"
                    />
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      value={settings.socialLinks?.youtube || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={saveSettings}
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Configuración'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
