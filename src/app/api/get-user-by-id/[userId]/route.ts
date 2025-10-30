import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest, context: { params: { userId: string } }) {
  try {
    const { userId } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}