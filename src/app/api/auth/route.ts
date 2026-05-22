import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const result = await sql`
      SELECT username, role FROM admin_users 
      WHERE username = ${username} AND password = ${password}
    `;
    
    if (result.rows.length > 0) {
      return NextResponse.json({ 
        success: true, 
        user: { username: result.rows[0].username, role: result.rows[0].role } 
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
