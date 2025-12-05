
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import ActionLog from '@/models/actionLog.model.js';
import { parseISO } from 'date-fns';

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        const { ids, filters } = body;

        if (ids && Array.isArray(ids) && ids.length > 0) {
            // Delete by specific IDs
            const result = await ActionLog.deleteMany({ _id: { $in: ids } });
            return NextResponse.json({ message: `${result.deletedCount} logs deleted successfully.` }, { status: 200 });
        } else if (filters) {
            // Build query from filters
            const query = {};
            if (filters.searchQuery) {
                const searchRegex = new RegExp(filters.searchQuery, 'i');
                query.$or = [
                    { action: searchRegex },
                    { user: searchRegex },
                ];
            }
            if (filters.dateRange?.from) {
                query.timestamp = { $gte: parseISO(filters.dateRange.from) };
            }
            if (filters.dateRange?.to) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$lte = parseISO(filters.dateRange.to);
            }
            if (filters.selectedTypes?.length > 0) {
                query.type = { $in: filters.selectedTypes };
            }
            if (filters.selectedSections?.length > 0) {
                query.section = { $in: filters.selectedSections };
            }

            const result = await ActionLog.deleteMany(query);
            return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} filtered logs.` }, { status: 200 });
        }

        return NextResponse.json({ message: 'No valid IDs or filters provided for deletion.' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting action logs.', error: error.message }, { status: 500 });
    }
}
