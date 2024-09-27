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

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotDuration={"00:15:00"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
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
            startTime: "17:45",
            endTime: "20:30",
          },
        ]}
        locale={"es"}
        slotMinTime="17:00:00"
        slotMaxTime="22:00:00"
        weekends={false} // Excluir fines de semana
      />
      <ToastContainer /> 
    </>
  );
};

export default Calendar;
