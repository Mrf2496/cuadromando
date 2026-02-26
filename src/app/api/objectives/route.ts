import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all objectives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const perspectiveId = searchParams.get('perspectiveId');

    const where = perspectiveId ? { perspectiveId } : {};

    const objectives = await db.strategicObjective.findMany({
      where,
      include: {
        perspective: true,
        policies: true,
        corporateGoals: true,
        strategies: true,
        kpis: {
          include: { history: { orderBy: { date: 'desc' }, take: 5 } }
        },
        actionPlans: {
          include: {
            goals: true,
            strategies: true,
            kpis: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json({ error: 'Error fetching objectives' }, { status: 500 });
  }
}

// POST - Create a new objective
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { perspectiveId, description, weight, targetDate, responsible } = body;

    // Count existing objectives for code generation
    const count = await db.strategicObjective.count();
    const code = `OBJ-${String(count + 1).padStart(3, '0')}`;

    const objective = await db.strategicObjective.create({
      data: {
        perspectiveId,
        code,
        description,
        weight: weight || 0,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        responsible,
        status: 'active',
      },
      include: {
        perspective: true
      }
    });

    return NextResponse.json(objective);
  } catch (error) {
    console.error('Error creating objective:', error);
    return NextResponse.json({ error: 'Error creating objective' }, { status: 500 });
  }
}
