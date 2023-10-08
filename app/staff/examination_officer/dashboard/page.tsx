"use client";

import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // Import Calendar
import { EventApi, DateSelectArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { z } from "zod";

// Define an interface for the event
interface Event {
  start: string;
  end: string;
  allDay: boolean;
  title: string;
  description: string;
}

const ExaminationOfficerDashboardPage = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

  // Use the Event interface as the type for your state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Provide the type for calendarRef
  const calendarRef = useRef<FullCalendar | null>(null);

  const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const data = {
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      title: "",
      description: "",
    };

    setSelectedEvent(data);
    const modal = document.getElementById("modal_1") as HTMLDialogElement;
    modal.showModal();
  };

  // Function to handle saving of the event
  const handleSaveEvent = () => {
    // Logic to save the event goes here
    console.log("Event saved:", selectedEvent);

    if (selectedEvent && calendarRef.current) {
      // Create a new event of type EventApi and add it to currentEvents
      const calendarApi = calendarRef.current.getApi();
      const newEvent = calendarApi.addEvent(selectedEvent);

      // Check if newEvent is not null before adding it to currentEvents
      if (newEvent) {
        setCurrentEvents([...currentEvents, newEvent]);
      }
    }

    // Close the modal after saving the event
    const modal = document.getElementById("modal_1") as HTMLDialogElement;
    modal.close();

    // Clear the selectedEvent state
    setSelectedEvent(null);
  };

  return (
    <div>
      <div>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          eventsSet={handleEvents}
          select={handleDateSelect} // Handle date selection
          eventAdd={(eventAddInfo) => console.log(eventAddInfo)}
          eventChange={(eventChangeInfo) => console.log(eventChangeInfo)}
          eventRemove={(eventRemoveInfo) => console.log(eventRemoveInfo)}
        />
      </div>
      <dialog id={"modal_1"} className="modal">
        <div className="modal-box">
          {selectedEvent && (
            <div>
              {/* Add input fields for the event details */}
              <input type="datetime-local" placeholder="Start Time" />
              <input type="datetime-local" placeholder="End Time" />
              <input type="checkbox" id="allDay" name="allDay" />
              <label htmlFor="allDay">All Day</label>
              <input
                type="text"
                placeholder="Title"
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
              ></textarea>
              {/* Add a button to save the event */}
              <button onClick={handleSaveEvent}>Save Event</button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ExaminationOfficerDashboardPage;
