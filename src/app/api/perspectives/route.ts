import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all perspectives for a plan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    const where = planId ? { strategicPlanId: planId } : {};

    const perspectives = await db.perspective.findMany({
      where,
      include: {
        objectives: {
          include: {
            policies: true,
            corporateGoals: true,
            strategies: true,
            kpis: true,
            actionPlans: true,
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(perspectives);
  } catch (error) {
    console.error('Error fetching perspectives:', error);
    return NextResponse.json({ error: 'Error fetching perspectives' }, { status: 500 });
  }
}

// POST - Create a new perspective
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategicPlanId, name, description, color, weight } = body;

    // Get the current max order
    const maxOrder = await db.perspective.aggregate({
      where: { strategicPlanId },
      _max: { order: true }
    });

    const perspective = await db.perspective.create({
      data: {
        strategicPlanId,
        name,
        description,
        color: color || '#3b82f6',
        weight: weight || 0,
        order: (maxOrder._max.order || 0) + 1,
      }
    });

    return NextResponse.json(perspective);
  } catch (error) {
    console.error('Error creating perspective:', error);
    return NextResponse.json({ error: 'Error creating perspective' }, { status: 500 });
  }
}
