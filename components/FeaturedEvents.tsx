import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getBaseUrl } from "@/lib/base-url";

async function fetchEvents(): Promise<IEvent[]> {
  const res = await fetch(new URL("/api/events", getBaseUrl()));
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
