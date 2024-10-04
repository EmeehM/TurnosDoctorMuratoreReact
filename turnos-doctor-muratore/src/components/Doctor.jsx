import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";

const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

const Doctor = () => {
    const [nombre, setNombre] = useState("");
    const [sugerencias, setSugerencias] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const [datosFormulario, setDatosFormulario] = useState({
        dni: "",
        nombre: "",
        apellido: "",
        obra_social: "",
        numero_asociado: "",
        historial_clinico: "",
        medicamentos: "",
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [modoCrear, setModoCrear] = useState(false);
    const [error, setError] = useState("");

    // Buscar sugerencias de pacientes
    const buscarSugerencias = async () => {
        const trimmedNombre = nombre.trim();
        if (!trimmedNombre) return;

        try {
            const { data, error } = await supabase
                .from("pacientesmuramar")
                .select("*")
                .ilike("nombre", `%${trimmedNombre}%`);
            if (error) throw error;
            setSugerencias(data || []);
            setError("");
        } catch (error) {
            console.error("Error buscando sugerencias:", error);
            setError("No se pudo realizar la búsqueda.");
        }
    };

    // Cargar los datos del paciente seleccionado
    const cargarPaciente = (pacienteSeleccionado) => {
        setModoCrear(false);
        setPaciente(pacienteSeleccionado);
        setDatosFormulario({
            dni: pacienteSeleccionado.dni,
            nombre: pacienteSeleccionado.nombre,
            apellido: pacienteSeleccionado.apellido,
            obra_social: pacienteSeleccionado.obra_social,
            numero_asociado: pacienteSeleccionado.numero_asociado,
            historial_clinico: pacienteSeleccionado.historial_clinico,
            medicamentos: pacienteSeleccionado.medicamentos,
        });
        setModoEdicion(true);
        setSugerencias([]);
    };

    // Manejar cambios en los inputs del formulario
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setDatosFormulario((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Agregar un nuevo paciente
    const agregarPaciente = async () => {
        const { dni, nombre, apellido, obra_social, numero_asociado, historial_clinico, medicamentos } = datosFormulario;

        if (!dni || !nombre || !apellido || !obra_social || !numero_asociado) {
            Swal.fire("Error", "Todos los campos son obligatorios.", "error");
            return;
        }

        if (isNaN(dni) || isNaN(numero_asociado)) {
            Swal.fire("Error", "DNI y Número de Afiliado deben ser numéricos.", "error");
            return;
        }

        try {
            await supabase.from("pacientesmuramar").insert([{
                nombre,
                apellido,
                dni,
                obra_social,
                numero_asociado,
                historial_clinico,
                medicamentos,
            }]);

            Swal.fire("Éxito", "Paciente agregado exitosamente.", "success");
            setDatosFormulario({
                dni: "",
                nombre: "",
                apellido: "",
                obra_social: "",
                numero_asociado: "",
                historial_clinico: "",
                medicamentos: "",
            });
            setSugerencias([]);
        } catch (error) {
            console.error("Error agregando paciente:", error);
            Swal.fire("Error", "No se pudo agregar el paciente.", "error");
        }
    };

    // Editar un paciente existente
    const editarPaciente = async () => {
        const { dni, nombre, apellido, obra_social, numero_asociado, historial_clinico, medicamentos } = datosFormulario;

        if (!dni || !nombre || !apellido || !obra_social || !numero_asociado) {
            Swal.fire("Error", "Todos los campos son obligatorios.", "error");
            return;
        }

        if (isNaN(dni) || isNaN(numero_asociado)) {
            Swal.fire("Error", "DNI y Número de Afiliado deben ser numéricos.", "error");
            return;
        }

        try {
            const { error } = await supabase.from("pacientesmuramar").update({
                nombre,
                apellido,
                obra_social,
                numero_asociado,
                historial_clinico,
                medicamentos,
            }).eq("dni", dni);

            if (error) throw error;

            Swal.fire("Éxito", "Paciente editado exitosamente.", "success");
            setPaciente(null);
            setDatosFormulario({
                dni: "",
                nombre: "",
                apellido: "",
                obra_social: "",
                numero_asociado: "",
                historial_clinico: "",
                medicamentos: "",
            });
            setModoEdicion(false);
        } catch (error) {
            console.error("Error editando paciente:", error);
            Swal.fire("Error", "No se pudo editar el paciente.", "error");
        }
    };

    // Eliminar un paciente
    const eliminarPaciente = async () => {
        const confirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });

        if (confirmacion.isConfirmed) {
            try {
                const { error } = await supabase.from("pacientesmuramar").delete().eq("dni", paciente.dni);
                if (error) throw error;

                Swal.fire("Éxito", "Paciente eliminado exitosamente.", "success");
                setPaciente(null);
                setDatosFormulario({
                    dni: "",
                    nombre: "",
                    apellido: "",
                    obra_social: "",
                    numero_asociado: "",
                    historial_clinico: "",
                    medicamentos: "",
                });
                setSugerencias([]);
            } catch (error) {
                console.error("Error eliminando paciente:", error);
                Swal.fire("Error", "No se pudo eliminar el paciente.", "error");
            }
        }
    };

    // Cancelar la edición de un paciente
    const cancelarEdicion = () => {
        setModoEdicion(false);
        setDatosFormulario({
            dni: "",
            nombre: "",
            apellido: "",
            obra_social: "",
            numero_asociado: "",
            historial_clinico: "",
            medicamentos: "",
        });
        setPaciente(null);
    };

    // Crear un nuevo paciente
    const crearNuevoPaciente = () => {
        setModoEdicion(true);
        setModoCrear(true);
        setPaciente(null);
        setDatosFormulario({
            dni: "",
            nombre: "",
            apellido: "",
            obra_social: "",
            numero_asociado: "",
            historial_clinico: "",
            medicamentos: "",
        });
        setSugerencias([]);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-200 mb-4">Buscar Paciente</h1>
            <div className="flex mb-4 space-x-2">
                <input
                    type="text"
                    placeholder="Ingrese el nombre del paciente"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-80 bg-white"
                />
                <button onClick={buscarSugerencias} className="bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700">
                    Buscar
                </button>
                <button onClick={crearNuevoPaciente} className="bg-green-600 text-white py-2 px-4 rounded shadow-md hover:bg-green-700">
                    Crear Nuevo Paciente
                </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {sugerencias.length > 0 && (
                <ul className="bg-white rounded shadow-md w-80">
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
                <div className="mt-4 bg-white rounded shadow-md p-4 w-80">
                    <h2 className="font-bold text-lg text-blue-600">Datos del Paciente</h2>
                    <p><strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}</p>
                    <p><strong>DNI:</strong> {paciente.dni}</p>
                    <p><strong>Obra Social:</strong> {paciente.obra_social}</p>
                    <p><strong>Número de Afiliado:</strong> {paciente.numero_asociado}</p>
                    <p><strong>Historial Clínico:</strong> {paciente.historial_clinico}</p>
                    <p><strong>Medicamentos:</strong> {paciente.medicamentos}</p>
                    <div className="flex space-x-2">
                        <button onClick={eliminarPaciente} className="bg-red-600 text-white py-1 px-2 rounded shadow-md hover:bg-red-700">Eliminar</button>
                        <button onClick={cancelarEdicion} className="bg-gray-400 text-white py-1 px-2 rounded shadow-md hover:bg-gray-500">Cancelar</button>
                    </div>
                </div>
            )}

            {modoEdicion && (
                <div className="mt-4 bg-white rounded shadow-md p-4 w-80">
                    <h2 className="font-bold text-lg text-blue-600">Formulario de Paciente</h2>
                    <input
                        type="number"
                        min={0}
                        name="dni"
                        value={datosFormulario.dni}
                        onChange={manejarCambioInput}
                        placeholder="DNI"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="nombre"
                        value={datosFormulario.nombre}
                        onChange={manejarCambioInput}
                        placeholder="Nombre"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="apellido"
                        value={datosFormulario.apellido}
                        onChange={manejarCambioInput}
                        placeholder="Apellido"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="obra_social"
                        value={datosFormulario.obra_social}
                        onChange={manejarCambioInput}
                        placeholder="Obra Social"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <input
                        type="number"
                        min={0}
                        name="numero_asociado"
                        value={datosFormulario.numero_asociado}
                        onChange={manejarCambioInput}
                        placeholder="Número de Afiliado"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <textarea
                        name="historial_clinico"
                        value={datosFormulario.historial_clinico}
                        onChange={manejarCambioInput}
                        placeholder="Historial Clínico"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    <textarea
                        name="medicamentos"
                        value={datosFormulario.medicamentos}
                        onChange={manejarCambioInput}
                        placeholder="Medicamentos"
                        className="border border-gray-300 rounded p-2 w-full mb-2"
                    />
                    {console.log(modoCrear)}
                    <button
                        onClick={modoCrear ?  agregarPaciente : editarPaciente}
                        className="bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700 w-full"
                    >
                        {modoCrear ?  'Agregar Paciente' : 'Editar Paciente'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Doctor;
