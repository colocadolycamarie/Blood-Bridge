export type Urgency = "Critical" | "Urgent" | "Routine";

export interface Request {
  id: string;
  hospital: string;
  location: string;
  distance: string; // e.g. "2.4 miles"
  bloodType: string;
  units: number;
  urgency: Urgency;
  postedAt: string;
}

export const mockRequests: Request[] = [
  {
    id: "REQ-001",
    hospital: "Central General Hospital",
    location: "Downtown Medical District",
    distance: "1.2 miles",
    bloodType: "O-",
    units: 4,
    urgency: "Critical",
    postedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: "REQ-002",
    hospital: "St. Jude's Care Center",
    location: "Westside",
    distance: "3.5 miles",
    bloodType: "A+",
    units: 2,
    urgency: "Urgent",
    postedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "REQ-003",
    hospital: "Mercy Children's Hospital",
    location: "North Hills",
    distance: "5.1 miles",
    bloodType: "B-",
    units: 1,
    urgency: "Routine",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "REQ-004",
    hospital: "City Trauma Center",
    location: "Downtown Medical District",
    distance: "1.5 miles",
    bloodType: "AB-",
    units: 6,
    urgency: "Critical",
    postedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
];

export const mockDonations = [
  { id: "DON-001", date: "2023-10-12", hospital: "Central General Hospital", bloodType: "O-", status: "Completed" },
  { id: "DON-002", date: "2023-06-05", hospital: "St. Jude's Care Center", bloodType: "O-", status: "Completed" },
  { id: "DON-003", date: "2022-11-20", hospital: "City Trauma Center", bloodType: "O-", status: "Completed" },
];

export const mockInventory = [
  { bloodType: "A+", units: 24, status: "Healthy" },
  { bloodType: "A-", units: 5, status: "Low" },
  { bloodType: "B+", units: 18, status: "Healthy" },
  { bloodType: "B-", units: 2, status: "Critical" },
  { bloodType: "AB+", units: 8, status: "Healthy" },
  { bloodType: "AB-", units: 1, status: "Critical" },
  { bloodType: "O+", units: 35, status: "Healthy" },
  { bloodType: "O-", units: 3, status: "Critical" },
];

export const bloodTypeCompatibility = [
  { type: "A+", givesTo: ["A+", "AB+"], receivesFrom: ["A+", "A-", "O+", "O-"] },
  { type: "A-", givesTo: ["A+", "A-", "AB+", "AB-"], receivesFrom: ["A-", "O-"] },
  { type: "B+", givesTo: ["B+", "AB+"], receivesFrom: ["B+", "B-", "O+", "O-"] },
  { type: "B-", givesTo: ["B+", "B-", "AB+", "AB-"], receivesFrom: ["B-", "O-"] },
  { type: "AB+", givesTo: ["AB+"], receivesFrom: ["Everyone"] },
  { type: "AB-", givesTo: ["AB+", "AB-"], receivesFrom: ["AB-", "A-", "B-", "O-"] },
  { type: "O+", givesTo: ["O+", "A+", "B+", "AB+"], receivesFrom: ["O+", "O-"] },
  { type: "O-", givesTo: ["Everyone"], receivesFrom: ["O-"] },
];
