'use server'

import Event from '@/database/event.model'
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB()

        const event = await Event.findOne({ slug }).lean()
        if (!event) return []

        const eventDoc = event as { _id: unknown; tags?: unknown }
        const tagsValue = eventDoc.tags
        const tags =
            Array.isArray(tagsValue) ? tagsValue.filter((t): t is string => typeof t === 'string') :
            typeof tagsValue === 'string' ? [tagsValue] :
            []
        if (tags.length === 0) return []

        const similarEvents = await Event.find({
            _id: { $ne: eventDoc._id },
            tags: { $in: tags }
        }).lean()

        return Array.isArray(similarEvents) ? similarEvents : []
    } catch {
        return []
    }
}
