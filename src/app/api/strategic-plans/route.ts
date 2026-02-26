import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all strategic plans
export async function GET() {
  try {
    const plans = await db.strategicPlan.findMany({
      include: {
        perspectives: {
          orderBy: { order: 'asc' }
        },
        teams: true,
        employees: true,
        alerts: {
          where: { isResolved: false }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching strategic plans:', error);
    return NextResponse.json({ error: 'Error fetching strategic plans' }, { status: 500 });
  }
}

// POST - Create a new strategic plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, description, generalResponsible, createDefaultPerspectives = true } = body;

    const plan = await db.strategicPlan.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        generalResponsible,
        status: 'active',
      }
    });

    // Create default perspectives if requested
    if (createDefaultPerspectives) {
      const defaultPerspectives = [
        { name: 'Financiera', color: '#10b981', weight: 17 },
        { name: 'Clientes', color: '#3b82f6', weight: 17 },
        { name: 'Procesos Internos', color: '#f59e0b', weight: 17 },
        { name: 'Aprendizaje y Crecimiento', color: '#8b5cf6', weight: 17 },
        { name: 'Innovación', color: '#ec4899', weight: 16 },
        { name: 'Sostenibilidad', color: '#06b6d4', weight: 16 },
      ];

      await db.perspective.createMany({
        data: defaultPerspectives.map((p, i) => ({
          strategicPlanId: plan.id,
          name: p.name,
          color: p.color,
          weight: p.weight,
          order: i + 1,
        }))
      });
    }

    const fullPlan = await db.strategicPlan.findUnique({
      where: { id: plan.id },
      include: {
        perspectives: { orderBy: { order: 'asc' } }
      }
    });

    return NextResponse.json(fullPlan);
  } catch (error) {
    console.error('Error creating strategic plan:', error);
    return NextResponse.json({ error: 'Error creating strategic plan' }, { status: 500 });
  }
}
