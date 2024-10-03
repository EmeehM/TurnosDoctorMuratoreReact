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
    const [error, setError] = useState("");

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

    const cargarPaciente = (pacienteSeleccionado) => {
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

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setDatosFormulario((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
                dni,
                nombre,
                apellido,
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

    const crearNuevoPaciente = () => {
        setModoEdicion(true);
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
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Buscar Paciente</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Ingrese el nombre del paciente"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border rounded p-2 mr-2"
                />
                <button onClick={buscarSugerencias} className="bg-blue-500 text-white py-1 px-4 rounded">
                    Buscar
                </button>
                <button onClick={crearNuevoPaciente} className="bg-green-500 text-white py-1 px-4 rounded ml-2">
                    Crear Nuevo Paciente
                </button>
            </div>

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

                    <button onClick={eliminarPaciente} className="bg-red-500 text-white py-1 px-4 rounded mt-2">
                        Eliminar Paciente
                    </button>
                </div>
            )}

            {modoEdicion && (
                <div className="mt-4">
                    <h2 className="font-bold">{paciente ? "Editar Paciente" : "Agregar Paciente"}</h2>
                    {Object.keys(datosFormulario).map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block mb-1">{key.replace("_", " ").charAt(0).toUpperCase() + key.slice(1)}</label>
                            {key === "historial_clinico" || key === "medicamentos" ? (
                                <textarea
                                    name={key}
                                    value={datosFormulario[key]}
                                    onChange={manejarCambioInput}
                                    className="border rounded p-2 w-full h-32"
                                />
                            ) : (
                                <input
                                    type={key === "dni" || key === "numero_asociado" ? "number" : "text"}
                                    name={key}
                                    value={datosFormulario[key]}
                                    onChange={manejarCambioInput}
                                    className="border rounded p-2 w-full"
                                    min={0}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex space-x-2">
                        <button onClick={paciente ? editarPaciente : agregarPaciente} className="bg-blue-500 text-white py-1 px-4 rounded">
                            {paciente ? "Guardar Cambios" : "Agregar Paciente"}
                        </button>
                        <button onClick={cancelarEdicion} className="bg-gray-500 text-white py-1 px-4 rounded">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Doctor;
