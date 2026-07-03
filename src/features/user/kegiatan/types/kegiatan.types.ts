export type ActionStyle = "gold" | "outline";
export type EventType = "dark" | "green";
export type CategoryType = string;

export interface Kegiatan {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  category: CategoryType;
  title: string;
  desc: string;
  location: string;
  image: string;
  type: EventType;
  action: string;
  actionStyle: ActionStyle;
  price: number;
  priceLabel: string;
  registrationLink?: string;
  organizer?: string;
  contactPerson?: string;
  speakers: string[];
}
