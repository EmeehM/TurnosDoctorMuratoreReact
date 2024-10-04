import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './Calendar';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

function Administracion() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      const { data: turnosData, error } = await supabase.from('turnos').select('*');
      if (error) {
        toast.error('Error al cargar los turnos: ' + error.message);
      } else {
        setTurnos(turnosData);
      }
    };

    fetchTurnos();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('turnos').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar el turno: ' + error.message);
    } else {
      setTurnos(turnos.filter((turno) => turno.id !== id));
      toast.success('Turno eliminado exitosamente');
    }
  };

  const eventosCalendario = turnos.map((turno) => ({
    title: `${turno.nombre} - ${turno.dni}`,
    start: turno.horario,
  }));

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 max-w-fit h-fit mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Panel de Administración</h2>
      
      <div className="mb-6">
        <Calendar></Calendar>
      </div>

      <table className="w-full text-left border-collapse mb-6">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 border-b">DNI</th>
            <th className="p-2 border-b">Nombre</th>
            <th className="p-2 border-b">Obra Social</th>
            <th className="p-2 border-b">Número Asociado</th>
            <th className="p-2 border-b">Horario</th>
            <th className="p-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No hay turnos registrados.</td>
            </tr>
          ) : (
            turnos.map((turno) => (
              <tr key={turno.id} className="bg-gray-700">
                <td className="p-2 border-b">{turno.dni}</td>
                <td className="p-2 border-b">{turno.nombre}</td>
                <td className="p-2 border-b">{turno.obra_social}</td>
                <td className="p-2 border-b">{turno.numero_asociado}</td>
                <td className="p-2 border-b">{new Date(turno.horario).toLocaleString()}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                    onClick={() => handleDelete(turno.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default Administracion;
