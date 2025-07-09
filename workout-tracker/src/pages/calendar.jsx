import React, { useState, useEffect} from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/calendar.css';

const locales = { 'en-US' : enUS };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales
});

const initialEvents = [
  {
    title: 'Test Event',
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
  {
    title: 'Another Event',
    start: new Date(new Date().setDate(new Date().getDate() + 7)), 
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
    allDay: true,
  },
  {
    title: '3rd Event',
    start: new Date(new Date().setDate(new Date().getDate() + 2)), 
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: true,
  }
];

function CalendarPage() {
  console.log("CalendarPage rendered");
  const [events, setEvents] = useState(initialEvents);
  const [date, setDate] = useState(new Date()); 
  const [view, setView] = useState('month');

  return (
    
    <div style={{ height: 600, margin: '2rem'}}>
      <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          date={date}
          view={view}                    
          onNavigate={(newDate) => {
            console.log('Navigate button clicked! New date:', newDate);
            setDate(newDate);
          }}
          onView={(newView) => {
            console.log('View button clicked! New view:', newView);
            setView(newView);
          }}
        />
    </div>
  );
}

export default CalendarPage;