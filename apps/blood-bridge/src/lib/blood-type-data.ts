export type Urgency = "Critical" | "Urgent" | "Routine";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

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
