import { NextRequest, NextResponse } from 'next/server';

interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAccountRequest = await request.json();

    // Basic validation (expand as needed)
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // TODO: Add logic to check if user exists, hash password, and save to DB

    // Example response
    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}