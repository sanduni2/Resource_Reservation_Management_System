"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reservationSchema = z.object({
  resourceId: z.string().min(1, "Select a resource."),
  date: z.string().min(1, "Choose a date."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time is required."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time is required."),
  purpose: z.string().min(3, "Purpose must be at least 3 characters."),
  reservedBy: z.string().min(2, "Please enter the booker name."),
});

export async function createReservation(formData: FormData) {
  const rawData = {
    resourceId: formData.get("resourceId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    purpose: formData.get("purpose"),
    reservedBy: formData.get("reservedBy"),
  };

  const parsed = reservationSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid reservation details." };
  }

  const { resourceId, date, startTime, endTime, purpose, reservedBy } = parsed.data;

  if (startTime >= endTime) {
    return { success: false, error: "End time must be later than the start time." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: false, error: "Database is not configured. Add DATABASE_URL to your environment before saving reservations." };
  }

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });

  if (!resource) {
    return { success: false, error: "The selected resource could not be found." };
  }

  const existingReservations = await prisma.reservation.findMany({ where: { resourceId, date } });

  const hasConflict = existingReservations.some((reservation) => {
    const startsBefore = reservation.startTime < endTime;
    const endsAfter = reservation.endTime > startTime;
    return startsBefore && endsAfter;
  });

  if (hasConflict) {
    return {
      success: false,
      error: `The ${resource.name} resource is already reserved during that time slot.`,
    };
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

  revalidatePath("/");
  return { success: true, message: "Reservation created successfully." };
}
