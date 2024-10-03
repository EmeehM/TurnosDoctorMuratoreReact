import { useState } from "react";
import Swal from "sweetalert2";
import Turnos from "./components/Turnos";
import Administracion from "./components/Administracion.jsx";
import Doctor from "./components/Doctor.jsx"; // Importa el componente de Doctor
import Calendar from "./components/Calendar"; // Importa el componente de Calendar

function App() {
  const [view, setView] = useState('turnos'); // Estado para controlar la vista
  const [isAdmin, setIsAdmin] = useState(false); // Estado para controlar si el usuario es admin

  const toggleView = (view) => {
    setView(view);
  };

  const handleAdminLogin = () => {
    Swal.fire({
      title: 'Ingresa la contraseña de admin',
      input: 'password',
      inputLabel: 'Contraseña',
      inputPlaceholder: 'Escribe tu contraseña',
      showCancelButton: true,
      confirmButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar',
      preConfirm: (password) => {
        // Verifica la contraseña ingresada (puedes cambiar "tu_contraseña" por la contraseña real)
        if (password === 'tu_contraseña') {
          setIsAdmin(true);
          Swal.fire('¡Bienvenido!', '', 'success');
        } else {
          Swal.fire('Contraseña incorrecta', '', 'error');
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-fit min-w-fit bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-white font-bold">Reserva de Turnos</h1>
          <div className="flex">
            <button 
              onClick={() => toggleView('turnos')} 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-500 transition duration-300">
              Turnos
            </button>
            {isAdmin && (
              <>
                <button 
                  onClick={() => toggleView('administracion')} 
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-500 transition duration-300">
                  Administración
                </button>
                <button 
                  onClick={() => toggleView('doctor')} 
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-500 transition duration-300">
                  Doctor
                </button>
              </>
            )}
            <button 
              onClick={handleAdminLogin} 
              className="bg-green-600 text-white py-2 px-4 rounded-lg ml-4 hover:bg-green-500 transition duration-300">
              Admin User
            </button>
          </div>
        </div>
        
        {view === 'turnos' && <Turnos />}
        {view === 'administracion' && <Administracion />}
        {view === 'doctor' && <Doctor />}
        {view === 'calendar' && <Calendar />} {/* Agrega esta línea para mostrar el calendario */}

      </div>
    </div>
  );
}

export default App;
