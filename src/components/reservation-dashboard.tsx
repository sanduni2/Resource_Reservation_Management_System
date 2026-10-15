"use client";

import { useState } from "react";

type ResourceReservation = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  reservedBy: string;
  status: string;
};

function getResourceAvailability(reservations: ResourceReservation[] = []) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);
  const sortedReservations = [...reservations].sort((first, second) =>
    `${first.date}${first.startTime}`.localeCompare(`${second.date}${second.startTime}`),
  );
  const activeReservation = sortedReservations.find(
    (reservation) =>
      reservation.date === today &&
      reservation.startTime <= currentTime &&
      reservation.endTime > currentTime,
  );
  const nextReservation = sortedReservations.find(
    (reservation) => `${reservation.date}${reservation.startTime}` > `${today}${currentTime}`,
  );

  if (activeReservation) {
    return { label: "In use now", detail: `${activeReservation.startTime} - ${activeReservation.endTime}`, tone: "busy" };
  }

  if (nextReservation) {
    return {
      label: "Available now",
      detail: `Next booking ${nextReservation.date} · ${nextReservation.startTime} - ${nextReservation.endTime}`,
      tone: "available",
    };
  }

  return { label: "Available all day", detail: "No upcoming bookings", tone: "available" };
}

export function ReservationDashboard({
  resources,
  summary,
  reservations,
}: {
  resources: Array<{
    id: string;
    name: string;
    type: string;
    location: string;
    capacity: number;
    isActive: boolean;
    reservations?: ResourceReservation[];
  }>;
  summary: {
    totalResources: number;
    activeResources: number;
    totalBookings: number;
    upcomingBookingCount: number;
  };
  reservations: Array<{
    id: string;
    resourceName: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    reservedBy: string;
  }>;
}) {
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasResources = resources.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      resourceId: formData.get("resourceId")?.toString() ?? "",
      date: formData.get("date")?.toString() ?? "",
      startTime: formData.get("startTime")?.toString() ?? "",
      endTime: formData.get("endTime")?.toString() ?? "",
      purpose: formData.get("purpose")?.toString() ?? "",
      reservedBy: formData.get("reservedBy")?.toString() ?? "",
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotice({ type: "error", message: result.error ?? "Unable to save the reservation." });
        return;
      }

      setNotice({ type: "success", message: result.message ?? "Reservation created successfully." });
      form.reset();
      setSelectedResourceId("");
      window.setTimeout(() => window.location.reload(), 500);
    } catch {
      setNotice({ type: "error", message: "The reservation service is unavailable. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <span className="brand-name">PrimeWave Lab</span>
            <span className="brand-subtitle">Workspace operations</span>
          </div>
        </div>
        <div className="topbar-status"><span className="live-dot" /> System online</div>
      </div>

      <header className="page-header">
        <div>
          <div className="header-tag">Operations</div>
          <h1>Resource Reservation Desk</h1>
          <p className="page-intro">A calmer way to find the right space, reserve it confidently, and keep every team in sync.</p>
        </div>
        <div className="date-chip"><span>Today</span><strong>{today}</strong></div>
      </header>

      <section className="hero-card">
        <div>
          <div className="hero-kicker">The daily overview</div>
          <h2>Make every shared space count.</h2>
          <p className="muted">Coordinate rooms, equipment, and event spaces from one reliable view of your workplace.</p>
          <div className="hero-summary">
            <div className="summary-card">
              <span>Total resources</span>
              <strong>{summary.totalResources}</strong>
            </div>
            <div className="summary-card">
              <span>Active</span>
              <strong>{summary.activeResources}</strong>
            </div>
            <div className="summary-card">
              <span>Bookings</span>
              <strong>{summary.totalBookings}</strong>
            </div>
            <div className="summary-card">
              <span>Upcoming</span>
              <strong>{summary.upcomingBookingCount}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div>
          <div className="panel">
            <div className="section-heading">
              <div><span className="eyebrow">Inventory</span><h2>Available resources</h2></div>
              <span className="count-label">{resources.length} resources</span>
            </div>
            <div className="resource-list">
              {resources.map((resource) => (
                <div className="resource-card" key={resource.id}>
                  <div className="resource-meta">
                    <div className="resource-badge">{resource.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <h3>{resource.name}</h3>
                      <p>{resource.type} <span className="meta-separator">/</span> {resource.location}</p>
                      <span className="capacity-label">Capacity {resource.capacity}</span>
                    </div>
                  </div>
                  {(() => {
                    const availability = resource.isActive
                      ? getResourceAvailability(resource.reservations)
                      : { label: "Inactive", detail: "Not available for booking", tone: "busy" };

                    return (
                      <div className={`availability ${availability.tone}`}>
                        <span className="status-pill"><span className="status-dot" />{availability.label}</span>
                        <span className="availability-detail">{availability.detail}</span>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className="booking-list">
            <div className="section-heading"><div><span className="eyebrow">Schedule</span><h2>Upcoming bookings</h2></div><span className="count-label">{reservations.length} scheduled</span></div>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <div className="reservation-item" key={reservation.id}>
                  <div>
                    <h3>{reservation.resourceName}</h3>
                    <p>
                      <strong>{reservation.date}</strong> • {reservation.startTime} - {reservation.endTime}
                    </p>
                    <p>{reservation.purpose}</p>
                  </div>
                  <div className="muted">Booked by {reservation.reservedBy}</div>
                </div>
              ))
            ) : (
              <div className="reservation-item">
                <p>No bookings currently scheduled.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="panel form-panel">
          <div>
            <span className="eyebrow">New reservation</span>
            <h2>Book a resource</h2>
            <p>Choose a resource and time. We will check for clashes before confirming it.</p>
          </div>

          {notice ? <div className={`notice ${notice.type}`}>{notice.message}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="resourceId">Resource</label>
                <select
                  id="resourceId"
                  name="resourceId"
                  value={selectedResourceId}
                  onChange={(event) => setSelectedResourceId(event.target.value)}
                  required
                  disabled={!hasResources}
                >
                  {!hasResources ? (
                    <option value="">No resources available</option>
                  ) : (
                    <>
                      <option value="">Select a resource</option>
                      {resources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="field">
                <label htmlFor="date">Date</label>
                <input id="date" name="date" type="date" min={today} defaultValue={today} required />
              </div>

              <div className="field">
                <label htmlFor="startTime">Start time</label>
                <input id="startTime" name="startTime" type="time" defaultValue="09:00" required />
              </div>

              <div className="field">
                <label htmlFor="endTime">End time</label>
                <input id="endTime" name="endTime" type="time" defaultValue="10:00" required />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="purpose">Purpose</label>
                <textarea id="purpose" name="purpose" placeholder="Describe the purpose of the reservation" required />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="reservedBy">Booked by</label>
                <input id="reservedBy" name="reservedBy" type="text" placeholder="Team or person name" required />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <button className="primary-btn" type="submit" disabled={isSubmitting || !hasResources}>
                <span>{isSubmitting ? "Checking availability..." : "Create reservation"}</span>
                {!isSubmitting && <span className="button-arrow">→</span>}
              </button>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}
