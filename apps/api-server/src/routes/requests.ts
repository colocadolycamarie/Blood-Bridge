import { Router, type IRouter } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { db, usersTable, bloodRequestsTable, bloodTypeEnum, urgencyEnum } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { writeRateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

router.get("/requests", async (_req, res) => {
  const rows = await db
    .select()
    .from(bloodRequestsTable)
    .where(eq(bloodRequestsTable.status, "open"))
    .orderBy(desc(bloodRequestsTable.createdAt));
  res.json({ requests: rows });
});

const createSchema = z.object({
  location: z.string().trim().min(1, "Enter a location or ward.").max(200),
  bloodType: z.enum(bloodTypeEnum.enumValues),
  units: z.number().int().min(1).max(50),
  urgency: z.enum(urgencyEnum.enumValues),
});

router.post("/requests", requireAuth, writeRateLimit, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user || user.role !== "hospital") {
    res.status(403).json({ error: "Only hospital accounts can post requests." });
    return;
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const [created] = await db
    .insert(bloodRequestsTable)
    .values({
      hospitalUserId: user.id,
      hospitalName: user.hospitalName ?? user.name,
      location: parsed.data.location,
      bloodType: parsed.data.bloodType,
      units: parsed.data.units,
      urgency: parsed.data.urgency,
    })
    .returning();

  res.status(201).json({ request: created });
});

router.post("/requests/:id/fulfill", requireAuth, writeRateLimit, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user || user.role !== "donor") {
    res.status(403).json({ error: "Only donor accounts can respond to requests." });
    return;
  }

  const requestId = String(req.params.id);

  const [updated] = await db
    .update(bloodRequestsTable)
    .set({ status: "fulfilled" })
    .where(and(eq(bloodRequestsTable.id, requestId), eq(bloodRequestsTable.status, "open")))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Request not found or already fulfilled." });
    return;
  }

  res.json({ request: updated });
});

export default router;
