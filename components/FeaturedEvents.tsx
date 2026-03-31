import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function fetchEvents(): Promise<IEvent[]> {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not set (needed to fetch /api/events from the server)."
    );
  }

  const res = await fetch(`${BASE_URL}/api/events`);
  if (!res.ok) {
    throw new Error(`Failed to load events: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { events?: IEvent[] };
  return data.events ?? [];
}

export default async function FeaturedEvents() {
  const events = await fetchEvents();

  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>

      <ul className="events">
        {events.length > 0 &&
          events.map((event) => (
            <li key={event.slug ?? event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
      </ul>
    </div>
  );
}

