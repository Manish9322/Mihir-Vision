import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import User from '@/models/user.model.js';
import Project from '@/models/project.model.js';
import Match from '@/models/match.model.js';
import TeamMember from '@/models/team.model.js';
import Client from '@/models/client.model.js';

async function getHeroStats() {
    await _db();

    // Fetch all data in parallel
    const [
        profile,
        projectsCount,
        matchesCount,
        teamCount,
        clientsCount
    ] = await Promise.all([
        User.findOne().select('phone email').lean(),
        Project.countDocuments(),
        Match.countDocuments(),
        TeamMember.countDocuments(),
        Client.countDocuments()
    ]);
    
    return {
        phone: profile?.phone || '+1 (555) 123-4567',
        email: profile?.email || 'contact@pinnaclepathways.com',
        projectsCount: projectsCount || 0,
        gamesCount: matchesCount || 0,
        teamCount: teamCount || 0,
        clientsCount: clientsCount || 0,
    };
}


export async function GET() {
  try {
    const stats = await getHeroStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching hero stats:', error);
    return NextResponse.json({ message: 'Error fetching hero stats.', error: error.message }, { status: 500 });
  }
}
