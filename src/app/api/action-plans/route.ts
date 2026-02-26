import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all action plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const objectiveId = searchParams.get('objectiveId');

    const where = objectiveId ? { objectiveId } : {};

    const actionPlans = await db.actionPlan.findMany({
      where,
      include: {
        objective: {
          include: { perspective: true }
        },
        strategy: true,
        corporateGoal: true,
        team: true,
        responsible: true,
        goals: true,
        strategies: true,
        kpis: true,
        assignments: {
          include: { employee: true }
        },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(actionPlans);
  } catch (error) {
    console.error('Error fetching action plans:', error);
    return NextResponse.json({ error: 'Error fetching action plans' }, { status: 500 });
  }
}

// POST - Create a new action plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      objectiveId, 
      strategyId, 
      corporateGoalId,
      name, 
      description, 
      responsibleId,
      teamId,
      startDate, 
      endDate, 
      budget 
    } = body;

    // Count existing action plans for code generation
    const count = await db.actionPlan.count();
    const code = `PA-${String(count + 1).padStart(3, '0')}`;

    const actionPlan = await db.actionPlan.create({
      data: {
        objectiveId,
        strategyId,
        corporateGoalId,
        code,
        name,
        description,
        responsibleId,
        teamId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
        budget: budget || 0,
        spentBudget: 0,
        progress: 0,
      },
      include: {
        objective: { include: { perspective: true } },
        team: true,
        responsible: true,
      }
    });

    return NextResponse.json(actionPlan);
  } catch (error) {
    console.error('Error creating action plan:', error);
    return NextResponse.json({ error: 'Error creating action plan' }, { status: 500 });
  }
}
