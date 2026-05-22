import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month');

    // Get all active employees
    const empResult = await sql`
      SELECT id, name, section, grp, location 
      FROM employees 
      WHERE active = true 
      ORDER BY grp, section, name
    `;
    const employees = empResult.rows;

    if (date) {
      // Daily attendance
      const attResult = await sql`
        SELECT employee_id, status 
        FROM attendance 
        WHERE date = ${date}
      `;
      const attendance: Record<number, string> = {};
      for (const row of attResult.rows) {
        attendance[row.employee_id] = row.status;
      }
      return NextResponse.json({ employees, attendance });
    }

    if (month) {
      // Monthly attendance - get all records for the month
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      const attResult = await sql`
        SELECT employee_id, date, status 
        FROM attendance 
        WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      `;
      const attendance: Record<number, Record<string, string>> = {};
      for (const row of attResult.rows) {
        const empId = row.employee_id;
        if (!attendance[empId]) attendance[empId] = {};
        // Format date as YYYY-MM-DD
        const d = new Date(row.date);
        const dateStr = d.toISOString().split('T')[0];
        attendance[empId][dateStr] = row.status;
      }
      return NextResponse.json({ employees, attendance });
    }

    return NextResponse.json({ error: 'Missing date or month parameter' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { records } = await request.json();
    
    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Missing records array' }, { status: 400 });
    }

    let saved = 0;
    for (const record of records) {
      if (record.status) {
        await sql`
          INSERT INTO attendance (employee_id, date, status) 
          VALUES (${record.employee_id}, ${record.date}, ${record.status})
          ON CONFLICT (employee_id, date) 
          DO UPDATE SET status = EXCLUDED.status
        `;
      } else {
        // Empty status = delete the record
        await sql`
          DELETE FROM attendance 
          WHERE employee_id = ${record.employee_id} AND date = ${record.date}
        `;
      }
      saved++;
    }

    return NextResponse.json({ success: true, saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
