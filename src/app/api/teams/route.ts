import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    const where = planId ? { strategicPlanId: planId } : {};

    const teams = await db.team.findMany({
      where,
      include: {
        members: true,
        leader: true,
        actionPlans: {
          include: { objective: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Error fetching teams' }, { status: 500 });
  }
}

// POST - Create a new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategicPlanId, name, leaderId, area, description } = body;

    const team = await db.team.create({
      data: {
        strategicPlanId,
        name,
        leaderId,
        area,
        description,
      },
      include: {
        members: true,
        leader: true
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Error creating team' }, { status: 500 });
  }
}
