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

  // Llamar a fetchTurnos cuando el componente cargue
  useEffect(() => {
    fetchTurnos();
  }, []);

  // Función para validar si todos los campos obligatorios están llenos
  const validateForm = () => {
    const { nombre, dni, obra_social, numero_asociado } = formData;

    if (!nombre || !dni || !obra_social || !numero_asociado) {
      toast.error("Por favor, completa todos los campos del formulario.");
      return false;
    }
    return true;
  };

  const handleDateClick = async (arg) => {
    const selectedDateTime = new Date(arg.dateStr);
    const currentDateTime = new Date();

    // Validar que la fecha seleccionada no esté en el pasado
    if (selectedDateTime < currentDateTime) {
      toast.error("No puedes reservar un turno en el pasado.");
      return;
    }

    // Validar que el formulario esté completo antes de continuar
    if (!validateForm()) {
      return; // Si la validación falla, no se continúa con la creación del turno
    }

    // Actualizar el formData con el horario seleccionado
    setFormData({ ...formData, horario: selectedDateTime.toISOString() });

    // Guardar el turno en la base de datos (en la tabla "turnos")
    const { error } = await supabase
      .from("turnos")
      .insert([{ ...formData, horario: selectedDateTime.toISOString() }]);

    if (error) {
      toast.error("Error al guardar el turno.");
    } else {
      toast.success("Turno reservado con éxito.");
      // Recargar los turnos para que se refleje el nuevo turno en el calendario
      fetchTurnos();
    }
  };

  return (
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
      dateClick={handleDateClick}
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
  );
};

export default Calendar;
