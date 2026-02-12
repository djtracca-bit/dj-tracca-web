import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { sendReservationEmail } from '../config/emailjs';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reservations, setReservations] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoFiesta: '',
    presupuesto: ''
  });

  // Cargar reservas desde Firebase
  useEffect(() => {
    loadReservations();
  }, [currentDate]);

  const loadReservations = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const q = query(
        collection(db, 'reservations'),
        where('year', '==', year),
        where('month', '==', month)
      );
      
      const querySnapshot = await getDocs(q);
      const reservationsData = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const key = `${data.year}-${data.month}-${data.day}`;
        reservationsData[key] = data.status;
      });
      
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    
    // Solo permitir reservar si está disponible (verde) o amarillo
    if (reservations[key] === 'ocupado') {
      alert('Este día ya está reservado');
      return;
    }
    
    setSelectedDay(day);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservationData = {
        ...formData,
        day: selectedDay,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        fecha: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toISOString(),
        status: 'pendiente', // amarillo
        createdAt: new Date().toISOString()
      };

      // Guardar en Firebase
      await addDoc(collection(db, 'reservations'), reservationData);

      // Enviar email usando EmailJS (GRATIS)
      await sendReservationEmail(reservationData);

      alert('¡Reserva enviada! Te contactaremos pronto.');
      
      // Resetear formulario
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        tipoFiesta: '',
        presupuesto: ''
      });
      setShowForm(false);
      setSelectedDay(null);
      
      // Recargar reservas
      loadReservations();
    } catch (error) {
      console.error('Error enviando reserva:', error);
      alert('Error al enviar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Días vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
      const status = reservations[key] || 'disponible';
      
      let bgColor = 'bg-green-600 hover:bg-green-500'; // Verde - disponible
      let statusText = 'Disponible';
      
      if (status === 'pendiente') {
        bgColor = 'bg-yellow-500 hover:bg-yellow-400';
        statusText = 'Disponible según horario';
      } else if (status === 'ocupado') {
        bgColor = 'bg-red-600 cursor-not-allowed';
        statusText = 'Reservado';
      }

      days.push(
        <div
          key={day}
          onClick={() => status !== 'ocupado' && handleDayClick(day)}
          className={`h-20 ${bgColor} rounded-lg p-2 cursor-pointer transition-all transform hover:scale-105 flex flex-col justify-between border border-white/10`}
        >
          <span className="font-bold text-white">{day}</span>
          <span className="text-xs text-white/90">{statusText}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-display font-bold mb-2 flex items-center justify-center gap-3">
          <CalendarIcon className="text-dj-red" size={40} />
          Calendario de Reservas
        </h2>
        <p className="text-dj-light-gray">Selecciona una fecha para tu evento</p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded"></div>
          <span className="text-sm">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
          <span className="text-sm">Disponible según horario</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded"></div>
          <span className="text-sm">Reservado</span>
        </div>
      </div>

      {/* Navegación del mes */}
      <div className="bg-dj-gray rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-dj-red rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h3 className="text-2xl font-display font-bold">
            {MESES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-dj-red rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DIAS_SEMANA.map(dia => (
            <div key={dia} className="text-center font-semibold text-dj-light-gray py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
      </div>

      {/* Formulario de reserva */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-dj-gray rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-display font-bold mb-6 text-center">
              Reservar día {selectedDay} de {MESES[currentDate.getMonth()]}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de fiesta</label>
                <select
                  required
                  value={formData.tipoFiesta}
                  onChange={(e) => setFormData({...formData, tipoFiesta: e.target.value})}
                  className="w-full"
                >
                  <option value="">Selecciona...</option>
                  <option value="boda">Boda</option>
                  <option value="cumpleaños">Cumpleaños</option>
                  <option value="corporativo">Evento corporativo</option>
                  <option value="discoteca">Discoteca</option>
                  <option value="privada">Fiesta privada</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Presupuesto aproximado (€)</label>
                <input
                  type="text"
                  required
                  value={formData.presupuesto}
                  onChange={(e) => setFormData({...formData, presupuesto: e.target.value})}
                  className="w-full"
                  placeholder="500-1000€"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedDay(null);
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
                  {loading ? <div className="spinner w-5 h-5"></div> : 'Enviar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
