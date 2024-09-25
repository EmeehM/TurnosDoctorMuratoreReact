import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from "./Calendar";

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
    horario: ''
  });

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    const { data, error } = await supabase.from('turnos').select('*');
    if (error) {
      console.error(error);
    } else {
      setTurnos(data);
    }
  };

  // Verifica si la fecha está dentro del horario comercial
  const isWithinBusinessHours = (date) => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return (
      (hour >= 17 && hour < 21) && // Solo entre las 17:00 y 20:45
      (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const existingTurnos = turnos.filter(turno => 
      new Date(turno.horario).toISOString() === new Date(formData.horario).toISOString()
    );

    if (existingTurnos.length > 0) {
      toast.error("Ya existe un turno en este horario.");
      return; // Detener la ejecución si ya existe un turno
    }

    // Verificar que el horario esté dentro del horario comercial
    const selectedDate = new Date(formData.horario);
    if (!isWithinBusinessHours(selectedDate)) {
      toast.error("El turno debe estar entre las 17:00 y las 21:00, en intervalos de 15 minutos.");
      return;
    }

    // Comprobar que no se seleccionen horarios pasados
    const currentDateTime = new Date();
    if (selectedDate < currentDateTime) {
      toast.error("No puedes reservar un turno en el pasado.");
      return; // Detener la ejecución si la fecha es pasada
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
      toast.error("Error al reservar el turno: " + error.message);
    } else {
      toast.success("Turno reservado exitosamente.");
      setTurnos([...turnos, ...data]);
      setFormData({ dni: '', nombre: '', obra_social: '', numero_asociado: '', horario: '' });
    }
  };

  const handleDateChange = (e) => {
    const selectedDateTime = new Date(e.target.value);
    const minutes = selectedDateTime.getMinutes();

    if (minutes % 15 !== 0) {
      toast.error("Solo puedes seleccionar horarios en intervalos de 15 minutos.");
      const roundedMinutes = Math.round(minutes / 15) * 15;
      selectedDateTime.setMinutes(roundedMinutes);
      setFormData({ ...formData, horario: selectedDateTime.toISOString().slice(0, 16) });
    } else {
      setFormData({ ...formData, horario: e.target.value });
    }
  };

  const handleDateClick = (arg) => {
    const selectedDateTime = new Date(arg.dateStr);
    const currentDateTime = new Date();

    // Asegurarse de que no se seleccionen horarios pasados
    if (selectedDateTime < currentDateTime) {
      toast.error("No puedes reservar un turno en el pasado.");
      return;
    }

    // Establecer el horario seleccionado en el formulario
    setFormData({ ...formData, horario: selectedDateTime.toISOString() });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="number" placeholder="DNI" value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} className="mb-2 p-2 border border-gray-300 rounded w-full" required />
        <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="mb-2 p-2 border border-gray-300 rounded w-full" required />
        <input type="text" placeholder="Obra Social" value={formData.obra_social} onChange={(e) => setFormData({ ...formData, obra_social: e.target.value })} className="mb-2 p-2 border border-gray-300 rounded w-full" required />
        <input type="number" placeholder="Número Asociado" value={formData.numero_asociado} onChange={(e) => setFormData({ ...formData, numero_asociado: e.target.value })} className="mb-2 p-2 border border-gray-300 rounded w-full" required />
        <input type="datetime-local" value={formData.horario} onChange={handleDateChange} className="mb-2 p-2 border border-gray-300 rounded w-full" required />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Reservar</button>
      </form>
      <Calendar turnos={turnos} formData={formData} setFormData={setFormData} />
      <ToastContainer />
    </div>
  );
}

export default Turnos;
