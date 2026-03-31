import {notFound} from "next/navigation";
import Image from "next/image";
import { cacheLife } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label:string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>
                    {item}
                </li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>
                {tag}
            </div>
        ))}
    </div>
)

function normalizeStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        // Common shape when the form submits a JSON string but the schema expects string[]:
        // the DB ends up with ["[\"a\",\"b\"]"].
        if (value.length === 1 && typeof value[0] === 'string') {
            const raw = value[0].trim();
            if (raw.startsWith('[')) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        return parsed.filter((v): v is string => typeof v === 'string');
                    }
                } catch {
                    // Fall through to treating it as a normal string[].
                }
            }
        }

        return value.filter((v): v is string => typeof v === 'string');
    }

    if (typeof value === 'string') {
        const raw = value.trim();
        if (raw.startsWith('[')) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed.filter((v): v is string => typeof v === 'string');
                }
            } catch {
                // Fall through.
            }
        }
        return raw ? [raw] : [];
    }

    return [];
}

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    'use cache';
    cacheLife('hours');

    const { slug } = await params;

    const url = BASE_URL
        ? `${BASE_URL.replace(/\/$/, '')}/api/events/${slug}`
        : `/api/events/${slug}`;

    const request = await fetch(url);
    if (!request.ok) return notFound();

    const data = await request.json().catch(() => null);
    const event = data?.event;

    if (!event?.description) return notFound();

    const { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } = event;
    const agendaItems = normalizeStringArray(agenda);
    const tagItems = normalizeStringArray(tags);

    return (
        <section id="event">
           <div className="header">
               <h1>Event Description</h1>
               <p>{description}</p>
           </div>

            <div className="details">

                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                            <h2>Overview</h2>
                            <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calender" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agendaItems} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tagItems} />

                </div>

                <aside className="booking">
                    <p className="text-lg font-semibold">Book Event</p>
                </aside>
            </div>
        </section>
    )
}
export default EventDetailsPage
