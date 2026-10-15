export type DemoResource = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  isActive: boolean;
  reservations: Array<{
    id: string;
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    reservedBy: string;
    status: string;
  }>;
};

const today = new Date();
const formatDate = (offset: number) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const demoResources: DemoResource[] = [
  {
    id: "res-1",
    name: "Boardroom A",
    type: "Meeting Room",
    location: "Floor 2",
    capacity: 12,
    isActive: true,
    reservations: [
      { id: "bk-1", resourceId: "res-1", date: formatDate(0), startTime: "09:00", endTime: "10:30", purpose: "Client sync", reservedBy: "Harini", status: "confirmed" },
      { id: "bk-2", resourceId: "res-1", date: formatDate(1), startTime: "14:00", endTime: "15:30", purpose: "Sprint planning", reservedBy: "Nimal", status: "confirmed" },
    ],
  },
  {
    id: "res-2",
    name: "Innovation Lab",
    type: "Workshop Space",
    location: "Floor 3",
    capacity: 8,
    isActive: true,
    reservations: [
      { id: "bk-3", resourceId: "res-2", date: formatDate(0), startTime: "11:00", endTime: "12:00", purpose: "Prototype testing", reservedBy: "Ashan", status: "confirmed" },
    ],
  },
  {
    id: "res-3",
    name: "Camera Kit",
    type: "Equipment",
    location: "Storage Room",
    capacity: 2,
    isActive: true,
    reservations: [
      { id: "bk-4", resourceId: "res-3", date: formatDate(2), startTime: "10:00", endTime: "12:00", purpose: "Interview shoot", reservedBy: "Kavindi", status: "confirmed" },
    ],
  },
  {
    id: "res-4",
    name: "Training Hall",
    type: "Event Space",
    location: "Ground Floor",
    capacity: 30,
    isActive: true,
    reservations: [],
  },
];
