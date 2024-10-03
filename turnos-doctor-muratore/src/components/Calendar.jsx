import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "@supabase/supabase-js";

// Crear cliente de Supabase
const supabaseUrl = import.meta.env.VITE_API_URL_SUPABASE;
const supabaseKey = import.meta.env.VITE_API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

const Calendar = ({ formData, setFormData }) => {
  const [turnos, setTurnos] = useState([]);
  const [view, setView] = useState("timeGridWeek"); // Estado para controlar la vista

  // Función para cargar turnos desde la tabla "turnos"
  const fetchTurnos = async () => {
    const { data, error } = await supabase.from("turnos").select("*");

    if (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error al obtener los turnos.");
    } else {
      setTurnos(data); // Actualizamos el estado de los turnos
    }
  };

  // Llamar a fetchTurnos cuando el componente cargue y cada 30 segundos
  useEffect(() => {
    fetchTurnos(); // Carga inicial de turnos
    const intervalId = setInterval(fetchTurnos, 30000); // Actualización cada 30 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  // Efecto para cambiar la vista del calendario en función del tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Cambia el 640 por el ancho que consideres para móviles
        setView("dayGridDay"); // Solo muestra el día en dispositivos móviles
      } else {
        setView("timeGridWeek"); // Muestra la vista semanal en dispositivos de escritorio
      }
    };

    handleResize(); // Llama a la función al cargar el componente
    window.addEventListener("resize", handleResize); // Agrega el evento para redimensionar

    return () => {
      window.removeEventListener("resize", handleResize); // Limpia el evento al desmontar
    };
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view} // Usa el estado para la vista inicial
        allDaySlot={false}
        slotDuration={"00:15:00"}
        headerToolbar={{
          left: "prev,next",
          center: "today", // Muestra los botones prev y next
          right: "timeGridWeek,timeGridDay",
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          omitZeroMinute: false,
          hour12: false,
        }}
        events={turnos.map((turno) => ({
          title: turno.nombre,
          start: turno.horario,
          end: new Date(
            new Date(turno.horario).getTime() + 15 * 60000
          ).toISOString(),
        }))}
        validRange={{
          start: new Date(),
          end: null,
        }}
        businessHours={[
          {
            daysOfWeek: [1, 2, 3, 4, 5], // Días laborales (lunes a viernes)
            startTime: "17:00",
            endTime: "22:00",
          },
        ]}
        locale={"es"}
        slotMinTime="17:00:00"
        slotMaxTime="22:00:00"
        weekends={false} // Excluir fines de semana
        className="border-2 border-gray-700 rounded-md w-full h-full" // Ocupa toda la pantalla
        dayHeaderClassNames="bg-gray-700 text-white"
        eventClassNames="bg-blue-600 text-white border-blue-800"
      />
      <ToastContainer />
    </div>
  );
};

export default Calendar;
