import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

const Doctor = () => {
    const [nombre, setNombre] = useState(""); // Para guardar el nombre ingresado
    const [sugerencias, setSugerencias] = useState([]); // Para guardar las sugerencias de búsqueda
    const [paciente, setPaciente] = useState(null); // Para guardar los datos del paciente
    const [error, setError] = useState(""); // Para manejar errores
  
    const buscarSugerencias = async () => {
      const trimmedNombre = nombre.trim();
      if (!trimmedNombre) return; // Evitar búsqueda vacía
      console.log("Buscando paciente:", trimmedNombre);

      try {
        const { data, error } = await supabase
          //.from('pacientesmuramar')
          //.select('nombre, apellido, dni, obra_social, numero_asociado, historial_clinico, medicamentos');
          //.ilike('nombre', `%${trimmedNombre}%`); // Asegúrate de que estos campos existan

          .from("pacientesmuramar")
          .select("*")
          .eq("nombre", `%Jor%`);
        if (error) throw error;
        console.log("Data:", data); // Ver qué devuelve la consulta
        console.log("Error:", error); // Ver si hay un error
  
        setSugerencias(data || []); // Asegúrate de establecer un array vacío si no hay datos
        setError(""); // Limpiar errores si hay datos
      } catch (error) {
        console.error("Error buscando sugerencias:", error);
        setError("No se pudo realizar la búsqueda.");
      }
    };
  
    const cargarPaciente = (pacienteSeleccionado) => {
      setPaciente(pacienteSeleccionado);
      setSugerencias([]); // Limpiar sugerencias después de seleccionar
    };
  
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Buscar Paciente</h1>
        <input
          type="text"
          placeholder="Ingrese el nombre del paciente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2 mb-4"
        />
        <button onClick={buscarSugerencias} className="bg-blue-500 text-white py-1 px-4 rounded mb-4">
          Buscar
        </button>
        
        {error && <p className="text-red-500">{error}</p>}
  
        {sugerencias.length > 0 && (
          <ul className="bg-white rounded shadow-md w-full max-w-xs">
            {sugerencias.map((paciente) => (
              <li
                key={paciente.dni}
                onClick={() => cargarPaciente(paciente)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {paciente.nombre} {paciente.apellido}
              </li>
            ))}
          </ul>
        )}
  
        {paciente && (
          <div className="mt-4">
            <h2 className="font-bold">Datos del Paciente</h2>
            <p><strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}</p>
            <p><strong>DNI:</strong> {paciente.dni}</p>
            <p><strong>Obra Social:</strong> {paciente.obra_social}</p>
            <p><strong>Número de Afiliado:</strong> {paciente.numero_asociado}</p>
            <p className="text-lg font-bold mt-2">Historial Clínico</p>
            <p>{paciente.historial_clinico || "No disponible"}</p>
            <p className="text-lg font-bold mt-2">Medicamentos Utilizados</p>
            <p>{paciente.medicamentos || "No disponible"}</p>
          </div>
        )}
      </div>
    );
};

export default Doctor;
