import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all employees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    const where = planId ? { strategicPlanId: planId } : {};

    const employees = await db.employee.findMany({
      where,
      include: {
        team: true,
        ledTeam: true,
        responsibleFor: {
          include: { objective: { include: { perspective: true } } }
        },
        assignments: {
          include: { actionPlan: true }
        },
        individualKPIs: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 });
  }
}

// POST - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategicPlanId, teamId, name, position, email, phone, avatar } = body;

    const employee = await db.employee.create({
      data: {
        strategicPlanId,
        teamId,
        name,
        position,
        email,
        phone,
        avatar,
      },
      include: {
        team: true
      }
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Error creating employee' }, { status: 500 });
  }
}
