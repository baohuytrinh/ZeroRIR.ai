import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US' : enUS };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales
});

const initialEvents = [
  {
    title: 'Chest Day',
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
  {
    title: 'Leg Day',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: true,
  },
];



function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <div style={{ height: 600, margin: '2rem'}}>
      <Calendar
        localizer = {localizer}
        events = {events}
        startAccessor = "start"
        endAccessor = "end"
        style = {{height:500}}
      />
    </div>
  )
}

export default CalendarPage