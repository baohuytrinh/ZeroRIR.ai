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
  const [plans, setPlans] = useState([]);
  
  const [draggedPlan, setDraggedPlan] = useState(null);


  useEffect(() => {
    fetchCalendarEvents().then(fetchedEvents => {
      //converted start/end to date objs
      const eventsWithDates = fetchedEvents.map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end)
      }));
      setEvents(eventsWithDates);
    });

    fetch('http://localhost:8000/api/plans', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
      .then(res => res.json())
      .then(setPlans);
  }, []);

  //moves objects/events
  const moveEvent = async ({ event, start, end, isAllDay }) => {
    const updated = { ...event, start, end, allDay: isAllDay };
    setEvents(events.map(ev => ev === event ? updated : ev));
    if (event._id) {
      await updateCalendarEvent(event._id, { start, end, allDay: isAllDay });
    }
  };

  //adding new events (button, external drag, etc)
  const handleAddEvent = async () => {
    const newEvent = {
      title: "Test Event",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), //1hr
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

  const handleDragStart = (plan) => {
    setDraggedPlan(plan);
  };

  const handleDropFromOutside = ({ start, end, allDay }) => {
    if (!draggedPlan) return;
    //creates new event based on plan
    const newEvent = {
      title: draggedPlan.name,
      start,
      end,
      allDay,
      plan: draggedPlan, //optionally store plan details
    };
    //save to db
    addCalendarEvent(newEvent).then(saved => {
      setEvents([...events, { ...saved, start: new Date(saved.start), end: new Date(saved.end) }]);
    });
  };

  return (
    <div className="calendar-container" style={{display: 'flex', justifyContent: 'center', gap: '3rem', border: '1px solid black'}}>
      <div className="plans-box" style={{width: 250, marginRight:20, border: '1px solid green'}}>
        <h4>Your workout plans</h4>
        {plans.map((plan, idx) => (
          <div 
            className="draggable-plan"
            key={idx}
            draggable

            onDragStart={() => handleDragStart(plan)}
            
            style={{
              border: '1px solid #ccc',
              margin: '8px 0',
              padding: 8,
              background: '#f9f9f9',
              cursor: 'grab'
            }}>
              <b>{plan.name}</b>
              <ul>
                {plan.exercises.map((ex, i) => (
                  <li key={i}> {ex.name} ({ex.muscle})</li>
                ))}
              </ul>
          </div>
        ))}
      </div>
      <div className='calendar' style={{ height: 600, margin: '2rem', width: '1000px'}}>
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
            
            onDropFromOutside={handleDropFromOutside}
            dragFromOutsideItem={() => draggedPlan}
          />
      </div>
    </div>
    
  );
}

export default CalendarPage;