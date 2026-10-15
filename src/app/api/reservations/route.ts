import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reservationSchema = z.object({
  resourceId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  purpose: z.string().min(3),
  reservedBy: z.string().min(2),
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not set. Configure PostgreSQL first." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid reservation input." }, { status: 400 });
    }

    const { resourceId, date, startTime, endTime, purpose, reservedBy } = parsed.data;

    if (startTime >= endTime) {
      return NextResponse.json({ error: "End time must be later than the start time." }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    const existingReservations = await prisma.reservation.findMany({ where: { resourceId, date } });
    const hasConflict = existingReservations.some((reservation) => {
      const startsBefore = reservation.startTime < endTime;
      const endsAfter = reservation.endTime > startTime;
      return startsBefore && endsAfter;
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: `The ${resource.name} resource is already reserved during that time slot.` },
        { status: 409 },
      );
    }

    await prisma.reservation.create({
      data: {
        resourceId,
        date,
        startTime,
        endTime,
        purpose,
        reservedBy,
        status: "confirmed",
      },
    });

    return NextResponse.json({ success: true, message: "Reservation created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Reservation creation failed:", error);
    return NextResponse.json({ error: "Failed to create reservation." }, { status: 500 });
  }
}
