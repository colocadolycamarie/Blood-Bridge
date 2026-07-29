import {
  pgTable,
  pgEnum,
  text,
  integer,
  uuid,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["donor", "hospital"]);
export const bloodTypeEnum = pgEnum("blood_type", [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);
export const urgencyEnum = pgEnum("urgency", ["Critical", "Urgent", "Routine"]);
export const requestStatusEnum = pgEnum("request_status", ["open", "fulfilled"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  bloodType: bloodTypeEnum("blood_type"),
  hospitalName: text("hospital_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bloodRequestsTable = pgTable("blood_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  hospitalUserId: uuid("hospital_user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hospitalName: text("hospital_name").notNull(),
  location: text("location").notNull(),
  bloodType: bloodTypeEnum("blood_type").notNull(),
  units: integer("units").notNull(),
  urgency: urgencyEnum("urgency").notNull(),
  status: requestStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const donationsTable = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorUserId: uuid("donor_user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hospitalName: text("hospital_name").notNull(),
  bloodType: bloodTypeEnum("blood_type").notNull(),
  donatedOn: text("donated_on").notNull(),
  status: text("status").notNull().default("Completed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inventoryTable = pgTable(
  "inventory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hospitalUserId: uuid("hospital_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    bloodType: bloodTypeEnum("blood_type").notNull(),
    units: integer("units").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("inventory_hospital_blood_type_idx").on(table.hospitalUserId, table.bloodType)],
);

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type BloodRequest = typeof bloodRequestsTable.$inferSelect;
export type NewBloodRequest = typeof bloodRequestsTable.$inferInsert;
export type Donation = typeof donationsTable.$inferSelect;
export type NewDonation = typeof donationsTable.$inferInsert;
export type InventoryRow = typeof inventoryTable.$inferSelect;
