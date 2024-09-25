import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

function AdminPanel() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    const { data, error } = await supabase.from('turnos').select('*');
    if (error) {
      toast.error("Error al cargar los turnos: " + error.message);
      console.error(error);
    } else {
      // Ordenar los turnos por horario más cercano
      const sortedTurnos = data.sort((a, b) => new Date(a.horario) - new Date(b.horario));
      setTurnos(sortedTurnos);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('turnos').delete().match({ id });
    if (error) {
      toast.error("Error al eliminar el turno: " + error.message);
    } else {
      toast.success("Turno eliminado exitosamente.");
      setTurnos(turnos.filter(turno => turno.id !== id)); // Actualiza la lista de turnos
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Registros de Turnos</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">DNI</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Obra Social</th>
            <th className="border border-gray-300 p-2">Número Asociado</th>
            <th className="border border-gray-300 p-2">Horario</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map(turno => (
            <tr key={turno.id}>
              <td className="border border-gray-300 p-2">{turno.dni}</td>
              <td className="border border-gray-300 p-2">{turno.nombre}</td>
              <td className="border border-gray-300 p-2">{turno.obra_social}</td>
              <td className="border border-gray-300 p-2">{turno.numero_asociado}</td>
              <td className="border border-gray-300 p-2">{new Date(turno.horario).toLocaleString()}</td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => handleDelete(turno.id)} 
                  className="bg-red-500 text-white py-1 px-2 rounded">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default AdminPanel;
