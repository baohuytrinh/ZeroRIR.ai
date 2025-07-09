import React, { useState, useEffect} from 'react';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/calendar.css';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { fetchCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent} from '../services/api.js';

const DnDCalendar = withDragAndDrop(Calendar);


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
  const [events, setEvents] = useState(initialEvents);
  const [date, setDate] = useState(new Date()); 
  const [view, setView] = useState('month');

  useEffect(() => {
    fetchCalendarEvents().then(fetchedEvents => {
      // Convert start/end to Date objects
      const eventsWithDates = fetchedEvents.map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end)
      }));
      setEvents(eventsWithDates);
    });
  }, []);

  // Handler for moving events
  const moveEvent = async ({ event, start, end, isAllDay }) => {
    const updated = { ...event, start, end, allDay: isAllDay };
    setEvents(events.map(ev => ev === event ? updated : ev));
    if (event._id) {
      await updateCalendarEvent(event._id, { start, end, allDay: isAllDay });
    }
  };

  // Handler for adding new events (e.g., via a button or external drag)
  const handleAddEvent = async () => {
    const newEvent = {
      title: "Test Event",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      allDay: false
    };
    const saved = await addCalendarEvent(newEvent);
    setEvents([...events, { ...saved, start: new Date(saved.start), end: new Date(saved.end) }]);
    };

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Delete event "${event.title}"?`)) {
      await deleteCalendarEvent(event._id);
      setEvents(events.filter(ev => ev._id !== event._id));
      }
  };

  return (
    
    <div style={{ height: 600, margin: '2rem'}}>
      <button className="add-event-btn" onClick={handleAddEvent} style={{marginBottom: 10}}>Add Test Event</button>
      <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          date={date}
          view={view}                    
          onNavigate={setDate}
          onView={setView}
          onEventDrop={moveEvent} 
          draggableAccessor={() => true} 
          onSelectEvent={handleDeleteEvent}
        />
    </div>
  );
}

export default CalendarPage;