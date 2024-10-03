import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Calendar from "./Calendar";
import TablaPacientes from "./TablaPacientes";

function Administracion() {
  const [codigo, setCodigo] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    obra_social: '',
    numero_asociado: '',
    horario: ''
  });

  return (
    <div>
        <div>
          <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
          <Calendar turnos={turnos} formData={formData} setFormData={setFormData} />
          <TablaPacientes></TablaPacientes>
        </div>
    </div>
  );
}

export default Administracion;
