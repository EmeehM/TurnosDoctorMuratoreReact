import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from "./Calendar";
import TablaPacientes from "./TablaPacientes";

function Administracion() {
  const [codigo, setCodigo] = useState('');
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    obra_social: '',
    numero_asociado: '',
    horario: ''
  });

  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes validar el código
    if (codigo === "admin123") {
      setMostrarPanel(true);
    } else {
      alert("Código incorrecto");
    }
  };

  return (
    <div>
      {!mostrarPanel ? (
        <form onSubmit={handleCodigoSubmit} className="mb-4">
          <input 
            type="password" 
            placeholder="Ingrese el código" 
            value={codigo} 
            onChange={(e) => setCodigo(e.target.value)} 
            className="mb-2 p-2 border border-gray-300 rounded w-full" 
            required 
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Acceder</button>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
          <Calendar turnos={turnos} formData={formData} setFormData={setFormData} />
          <TablaPacientes></TablaPacientes>
        </div>
      )}
    </div>
  );
}

export default Administracion;
