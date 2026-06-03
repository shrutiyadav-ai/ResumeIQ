import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma, { isConnectionError } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const emailNormalized = email.toLowerCase().trim();

    console.log(`[Auth] Registration request received for email: ${emailNormalized}`);

    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      console.warn(`[Auth] Registration failed: Email ${emailNormalized} is already registered.`);
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: emailNormalized,
        password: hashedPassword,
      },
    });

    console.log(`[Auth] User created successfully: ID ${user.id}, Email ${user.email}`);

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: { id: user.id, email: user.email, name: user.name } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Auth] Registration exception detail:", error);
    const dbPath = process.env.DATABASE_URL || "file:./dev.db";
    const detailedMessage = `Registration failed: ${error.message || "Internal Server Error"}. (Prisma client targeting SQLite database: ${dbPath})`;
    
    if (isConnectionError(error)) {
      return NextResponse.json(
        { error: `Database connection failed. ${detailedMessage}` },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: detailedMessage },
      { status: 500 }
    );
  }
}
