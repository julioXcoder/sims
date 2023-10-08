"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import { EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

interface Event {
  id?: string;
  start: string;
  end: string;
  allDay: boolean;
  title: string;
  description: string;
}

interface ExaminationOfficerDashboardPageState {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
  selectedEvent: Event | null;
}

class ExaminationOfficerDashboardPage extends React.Component<
  {},
  ExaminationOfficerDashboardPageState
> {
  calendarComponentRef = React.createRef<FullCalendar>();

  constructor(props: {}) {
    super(props);
    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      selectedEvent: null,
    };
  }

  handleEvents = (events: EventApi[]) => {
    this.setState({ currentEvents: events });
  };

  handleDateSelect = (selectInfo: DateSelectArg) => {
    const data = {
      id: Date.now().toString(),
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      title: "",
      description: "",
    };

    this.setState({ selectedEvent: data });
    const modal = document.getElementById("modal_1") as HTMLDialogElement;
    modal.showModal();
  };

  handleEventClick = (clickInfo: EventClickArg) => {
    this.setState({
      selectedEvent: {
        id: clickInfo.event.id,
        start: clickInfo.event.startStr,
        end: clickInfo.event.endStr,
        allDay: clickInfo.event.allDay,
        title: clickInfo.event.title,
        description: clickInfo.event.extendedProps.description,
      },
    });
    const modal = document.getElementById("modal_2") as HTMLDialogElement;
    modal.showModal();
  };

  handleSaveEvent = () => {
    if (this.state.selectedEvent && this.calendarComponentRef.current) {
      const calendarApi = this.calendarComponentRef.current.getApi();
      const newEvent = calendarApi.addEvent({
        ...this.state.selectedEvent,
        extendedProps: { description: this.state.selectedEvent.description },
      });

      if (newEvent) {
        this.setState({
          currentEvents: [...this.state.currentEvents, newEvent],
        });
      }
    }

    const modal = document.getElementById("modal_1") as HTMLDialogElement;
    modal.close();
    this.setState({ selectedEvent: null });
  };

  handleDeleteEvent = () => {
    if (
      this.state.selectedEvent &&
      this.state.selectedEvent.id &&
      this.calendarComponentRef.current
    ) {
      const calendarApi = this.calendarComponentRef.current.getApi();
      const eventToRemove = calendarApi.getEventById(
        this.state.selectedEvent.id,
      );

      if (eventToRemove) {
        eventToRemove.remove();
        this.setState({
          currentEvents: this.state.currentEvents.filter(
            (event) =>
              this.state.selectedEvent &&
              this.state.selectedEvent.id &&
              event.id !== this.state.selectedEvent.id,
          ),
        });

        const modal = document.getElementById("modal_2") as HTMLDialogElement;
        modal.close();
        this.setState({ selectedEvent: null });
      }
    }
  };

  render() {
    return (
      <div>
        <div>
          <FullCalendar
            ref={this.calendarComponentRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            eventsSet={this.handleEvents}
            select={this.handleDateSelect}
            eventClick={this.handleEventClick}
          />
        </div>
        <dialog id={"modal_1"} className="modal">
          <div className="modal-box">
            {this.state.selectedEvent && (
              <div>
                {/* Add input fields for the event details */}
                <input type="time" placeholder="Start Time" />
                <input type="datetime-local" placeholder="End Time" />
                <input type="checkbox" id="allDay" name="allDay" />
                <label htmlFor="allDay">All Day</label>
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) =>
                    this.state.selectedEvent &&
                    this.setState({
                      selectedEvent: {
                        ...this.state.selectedEvent,
                        title: e.target.value,
                      },
                    })
                  }
                />

                <textarea
                  placeholder="Description"
                  onChange={(e) =>
                    this.state.selectedEvent &&
                    this.setState({
                      selectedEvent: {
                        ...this.state.selectedEvent,
                        description: e.target.value,
                      },
                    })
                  }
                ></textarea>

                {/* Add a button to save the event */}
                <button onClick={this.handleSaveEvent}>Save Event</button>
              </div>
            )}
          </div>
        </dialog>
        <dialog id={"modal_2"} className="modal">
          <div className="modal-box">
            {this.state.selectedEvent && (
              <div>
                {/* Show the event details */}
                <p>Title: {this.state.selectedEvent.title}</p>
                <p>Description: {this.state.selectedEvent.description}</p>
                <p>Start: {this.state.selectedEvent.start}</p>
                <p>End: {this.state.selectedEvent.end}</p>
                <p>All Day: {this.state.selectedEvent.allDay ? "Yes" : "No"}</p>
                {/* Add a button to delete the event */}
                <button onClick={this.handleDeleteEvent}>Delete Event</button>
              </div>
            )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default ExaminationOfficerDashboardPage;
