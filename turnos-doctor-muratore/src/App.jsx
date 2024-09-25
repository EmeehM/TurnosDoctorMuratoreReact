import { useState } from "react";
import Turnos from "./components/Turnos";
import Administracion from "./components/Administracion.jsx" // Importa el componente de administración

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // Estado para controlar la vista

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-900">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Reserva de Turnos Dr Muratore</h1>
          <button 
            onClick={toggleAdmin} 
            className="bg-blue-500 text-white py-1 px-2 rounded ml-4">
            {isAdmin ? 'Volver' : 'Administración'}
          </button>
        </div>
        {isAdmin ? <Administracion /> : <Turnos />} {/* Muestra el componente adecuado */}
      </div>
    </div>
  );
}

export default App;
