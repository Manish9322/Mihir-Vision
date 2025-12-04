
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Visit from '@/models/visit.model.js';
import { startOfDay, subDays } from 'date-fns';

async function getAnalytics() {
    await _db();
    
    const thirtyDaysAgo = subDays(new Date(), 30);

    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = (await Visit.distinct('visitorId')).length;
    
    const avgDurationResult = await Visit.aggregate([
        { $match: { duration: { $ne: null } } },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);
    const averageSessionDuration = avgDurationResult[0]?.avgDuration.toFixed(2) || 0;
    
    const visitsPerPage = await Visit.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $project: { page: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
    ]);
    
    const deviceDistribution = await Visit.aggregate([
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $project: { device: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
    ]);

    const browserDistribution = await Visit.aggregate([
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $project: { browser: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    const osDistribution = await Visit.aggregate([
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $project: { os: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    const dailyVisits = await Visit.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $project: { date: '$_id', count: 1, _id: 0 } },
        { $sort: { date: 1 } }
    ]);

    return {
        totalVisits,
        uniqueVisitors,
        averageSessionDuration,
        visitsPerPage,
        deviceDistribution,
        browserDistribution,
        osDistribution,
        dailyVisits
    };
}


export async function GET() {
  try {
    const analyticsData = await getAnalytics();
    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ message: 'Error fetching analytics.', error: error.message }, { status: 500 });
  }
}
