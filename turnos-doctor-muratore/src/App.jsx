import { useState } from "react";
import Turnos from "./components/Turnos";
import Administracion from "./components/Administracion.jsx";
import Doctor from "./components/Doctor.jsx"; // Importa el componente de Doctor

function App() {
  const [view, setView] = useState('turnos'); // Estado para controlar la vista

  const toggleView = (view) => {
    setView(view);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-900">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Reserva de Turnos Dr Muratore</h1>
          <div className="flex">
            <button 
              onClick={() => toggleView('turnos')} 
              className="bg-blue-500 text-white py-1 px-2 rounded ml-4">
              Turnos
            </button>
            <button 
              onClick={() => toggleView('administracion')} 
              className="bg-blue-500 text-white py-1 px-2 rounded ml-4">
              Administración
            </button>
            <button 
              onClick={() => toggleView('doctor')} 
              className="bg-blue-500 text-white py-1 px-2 rounded ml-4">
              Doctor
            </button>
          </div>
        </div>
        {view === 'turnos' && <Turnos />}
        {view === 'administracion' && <Administracion />}
        {view === 'doctor' && <Doctor />}
      </div>
    </div>
  );
}

export default App;
