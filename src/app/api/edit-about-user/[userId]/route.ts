import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT ( request: NextRequest, context: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = await context.params;
    const putData = await request.json();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!putData.about) {
      return NextResponse.json({ error: "Missing 'about' field" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { about: putData.about },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error!"}, { status: 500 });
  }
}