import { NextRequest, NextResponse } from 'next/server';

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  id: string;
  name: string;
  email: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateUserRequest = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Add logic to save user to database and hash password
    // This is a placeholder user object
    const newUser: CreateUserResponse = {
      id: 'generated-user-id',
      name: body.name,
      email: body.email,
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}