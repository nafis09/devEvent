'use server'

import Booking from "@/database/booking.model";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: {eventId: string, slug: string, email: string}) => {
    try {
        if (!eventId || typeof eventId !== 'string' || !mongoose.isValidObjectId(eventId)) {
            return { success: false, error: 'Invalid event id.', bookingId: null as null };
        }
        if (!email || typeof email !== 'string' || email.trim() === '') {
            return { success: false, error: 'Email is required.', bookingId: null as null };
        }

        await connectDB()

        const created = await Booking.create({ eventId, slug, email });

        return { success: true, error: null as null, bookingId: String(created._id) };
    } catch (e) {
        console.error('create booking failed', e);
        // Duplicate booking (unique index: eventId + email)
        if (
            typeof e === 'object' &&
            e !== null &&
            'code' in e &&
            (e as { code?: unknown }).code === 11000
        ) {
            return { success: false, error: 'You already booked this event with this email.', bookingId: null as null };
        }

        if (e instanceof Error) {
            if (e.message.includes('MONGODB_URI')) {
                return { success: false, error: 'Database is not configured (missing MONGODB_URI).', bookingId: null as null };
            }
            // Surface the real message so you can debug quickly (duplicate, validation, connectivity, etc.).
            return { success: false, error: e.message || 'Booking creation failed.', bookingId: null as null };
        }

        return { success: false, error: 'Booking creation failed.', bookingId: null as null };
    }
}
