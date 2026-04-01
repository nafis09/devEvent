'use client'

import { useState } from "react";
import posthog from "posthog-js";
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);

        if (!eventId || !slug) {
            setError('Missing event info. Refresh the page and try again.');
            return;
        }
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        try {
            const res = await createBooking({ eventId, slug, email });

            if (res.success) {
                setSubmitted(true);
                setBookingId(res.bookingId ?? null);
                posthog.capture('event_booked', { eventId, slug, email, bookingId: res.bookingId ?? null });
            } else {
                setError(res.error ?? 'Booking creation failed.');
                console.error('Booking creation failed:', res.error);
                posthog.capture('booking_failed', { eventId, slug, email, reason: res.error ?? 'Booking creation failed' });
            }
        } catch (err) {
            setError('Booking creation failed.');
            console.error('Booking creation failed:', err);
            posthog.capture('booking_failed', {
                eventId,
                slug,
                email,
                reason: err instanceof Error ? err.message : 'Booking creation failed'
            });
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <div className="text-sm">
                    <p>Thank you for signing up!</p>
                </div>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter Your Email Address"
                        />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                    {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
                </form>
            )}
        </div>
    )
}
export default BookEvent
