import { Router, type IRouter } from "express";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db, usersTable, donationsTable, bloodTypeEnum } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { writeRateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

router.get("/donations", requireAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(donationsTable)
    .where(eq(donationsTable.donorUserId, req.userId!))
    .orderBy(desc(donationsTable.donatedOn));
  res.json({ donations: rows });
});

const createSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date.")
    .refine((d) => new Date(d) <= new Date(), "Date cannot be in the future."),
  hospital: z.string().trim().min(1, "Enter a hospital or facility.").max(200),
  bloodType: z.enum(bloodTypeEnum.enumValues),
});

router.post("/donations", requireAuth, writeRateLimit, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user || user.role !== "donor") {
    res.status(403).json({ error: "Only donor accounts can log donations." });
    return;
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const [created] = await db
    .insert(donationsTable)
    .values({
      donorUserId: user.id,
      hospitalName: parsed.data.hospital,
      bloodType: parsed.data.bloodType,
      donatedOn: parsed.data.date,
    })
    .returning();

  res.status(201).json({ donation: created });
});

export default router;
