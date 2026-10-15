import { getDashboardData } from "@/lib/data";
import { ReservationDashboard } from "@/components/reservation-dashboard";

export default async function HomePage() {
  const { resources, summary, reservations } = await getDashboardData();

  return (
    <ReservationDashboard
      resources={resources}
      summary={summary}
      reservations={reservations}
    />
  );
}
