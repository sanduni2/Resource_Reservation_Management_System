import { prisma } from "@/lib/prisma";
import { demoResources } from "@/lib/demo-data";

export async function getDashboardData() {
  if (!process.env.DATABASE_URL) {
    return {
      resources: demoResources,
      summary: {
        totalResources: demoResources.length,
        activeResources: demoResources.filter((resource) => resource.isActive).length,
        totalBookings: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
        upcomingBookingCount: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
      },
      reservations: demoResources.flatMap((resource) =>
        resource.reservations.map((reservation) => ({ ...reservation, resourceName: resource.name })),
      ),
    };
  }

  try {
    const resources = await prisma.resource.findMany({
      include: { reservations: { orderBy: { startTime: "asc" } } },
      orderBy: { name: "asc" },
    });

    if (resources.length === 0) {
      return {
        resources: demoResources,
        summary: {
          totalResources: demoResources.length,
          activeResources: demoResources.filter((resource) => resource.isActive).length,
          totalBookings: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
          upcomingBookingCount: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
        },
        reservations: demoResources.flatMap((resource) =>
          resource.reservations.map((reservation) => ({ ...reservation, resourceName: resource.name })),
        ),
      };
    }

    const allReservations = resources.flatMap((resource) =>
      resource.reservations.map((reservation) => ({
        ...reservation,
        resourceName: resource.name,
      })),
    );

    return {
      resources,
      summary: {
        totalResources: resources.length,
        activeResources: resources.filter((resource) => resource.isActive).length,
        totalBookings: allReservations.length,
        upcomingBookingCount: allReservations.length,
      },
      reservations: allReservations.sort((a, b) => {
        if (a.date === b.date) {
          return a.startTime.localeCompare(b.startTime);
        }
        return a.date.localeCompare(b.date);
      }),
    };
  } catch (error) {
    console.warn("Using demo data because the database is unavailable:", error);
    return {
      resources: demoResources,
      summary: {
        totalResources: demoResources.length,
        activeResources: demoResources.filter((resource) => resource.isActive).length,
        totalBookings: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
        upcomingBookingCount: demoResources.reduce((sum, resource) => sum + resource.reservations.length, 0),
      },
      reservations: demoResources.flatMap((resource) =>
        resource.reservations.map((reservation) => ({ ...reservation, resourceName: resource.name })),
      ),
    };
  }
}
