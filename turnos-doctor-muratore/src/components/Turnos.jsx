import { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@supabase/supabase-js";  
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import Calendar from './Calendar';
import { AiOutlineCloseCircle } from 'react-icons/ai';

registerLocale('es', es);

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    obra_social: '',
    numero_asociado: '',
    horario: new Date()
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

  useEffect(() => {
    const fetchTurnos = async () => {
      const { data: turnosData, error } = await supabase
        .from('turnos')
        .select('*');

      if (error) {
        toast.error("Error al cargar turnos: " + error.message);
      } else if (turnosData) { 
        setTurnos(turnosData);
      } else {
        toast.error("No se encontraron turnos.");
      }
    };
    fetchTurnos();
  }, []);

  const handleDateChange = (date) => {
    setFormData({ ...formData, horario: date });
  };

  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
  };

  const isWithinBusinessHours = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isInValidInterval = (hours >= 17 && hours <= 22);
    return isInValidInterval && minutes % 15 === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); 

    const existingTurnos = turnos.filter(turno =>
      new Date(turno.horario).toISOString() === new Date(formData.horario).toISOString()
    );

    if (existingTurnos.length > 0) {
      toast.error("Ya existe un turno en este horario.");
      setIsButtonDisabled(false); 
      return;
    }

    const selectedDate = new Date(formData.horario);
    if (!isWithinBusinessHours(selectedDate)) {
      toast.error("El turno debe estar entre las 17:00-22:00 en intervalos de 15 minutos.");
      setIsButtonDisabled(false);
      return;
    }

    const currentDateTime = new Date();
    if (selectedDate < currentDateTime) {
      toast.error("No puedes reservar un turno en el pasado.");
      setIsButtonDisabled(false);
      return;
    }

    const { data, error } = await supabase
      .from('turnos')
      .insert([{
        dni: formData.dni,
        nombre: formData.nombre,
        obra_social: formData.obra_social,
        numero_asociado: formData.numero_asociado,
        horario: formData.horario,
      }]);

    if (error) {
      console.error("Error al reservar el turno:", error);
      toast.error("Error al reservar el turno: " + error.message);
      setIsButtonDisabled(false); 
    } else {
      setSuccessMessage("Turno reservado exitosamente."); 
      setTurnos([...turnos, data[0]]); 
      setFormData({ dni: '', nombre: '', obra_social: '', numero_asociado: '', horario: new Date() });
      setIsButtonDisabled(false); 
      setTimeout(() => {
        setSuccessMessage(""); 
      }, 2000);
    }
  };

  const generateAllowedTimes = () => {
    const times = [];
    const today = new Date(); 
    const startHour = 17;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
      times.push(new Date(today.setHours(hour, 0, 0, 0))); 
      times.push(new Date(today.setHours(hour, 15, 0, 0))); 
      times.push(new Date(today.setHours(hour, 30, 0, 0))); 
      times.push(new Date(today.setHours(hour, 45, 0, 0))); 
    }
    times.push(new Date(today.setHours(22, 0, 0, 0))); 

    return times;
  };

  const closingSuccess = () => {
    setSuccessMessage("");
    setIsButtonDisabled(false);
  };

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 max-w-fit h-fit mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Reserva de Turnos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="number" 
          placeholder="DNI" 
          value={formData.dni} 
          onChange={(e) => setFormData({ ...formData, dni: e.target.value })} 
          className="p-3 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" 
          required 
        />
        <input 
          type="text" 
          placeholder="Nombre" 
          value={formData.nombre} 
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
          className="p-3 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" 
          required 
        />
        <input 
          type="text" 
          placeholder="Obra Social" 
          value={formData.obra_social} 
          onChange={(e) => setFormData({ ...formData, obra_social: e.target.value })} 
          className="p-3 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" 
          required 
        />
        <input 
          type="number" 
          placeholder="Número Asociado" 
          value={formData.numero_asociado} 
          onChange={(e) => setFormData({ ...formData, numero_asociado: e.target.value })} 
          className="p-3 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" 
          required 
        />
        
        <div className={``}>
          <ReactDatePicker
            selected={formData.horario}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            includeTimes={generateAllowedTimes()}  
            locale="es"
            dateFormat="Pp"
            minDate={new Date()}
            className={`p-3 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white`}
            onCalendarOpen={handleDatePickerOpen}
            onCalendarClose={handleDatePickerClose}
            required
          />
        </div>
        <button 
          type="submit" 
          className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={isButtonDisabled}
        >
          Reservar
        </button>
        {successMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative z-50">
            <span>{successMessage}</span>
            <AiOutlineCloseCircle 
              className="absolute top-1 right-1 cursor-pointer text-green-700" 
              onClick={closingSuccess} 
            />
          </div>
        )}
      </form>
      {!isDatePickerOpen ? (
        <Calendar turnos={turnos} formData={formData} setFormData={setFormData} />
      ) : (
        <div className='p-20'></div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Turnos;
