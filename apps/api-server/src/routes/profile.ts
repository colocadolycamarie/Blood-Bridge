import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, usersTable, bloodTypeEnum } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { writeRateLimit } from "../middlewares/rate-limit";
import { toPublicUser } from "../lib/public-user";

const router: IRouter = Router();

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bloodType: z.enum(bloodTypeEnum.enumValues).optional(),
  hospitalName: z.string().trim().min(1).max(200).optional(),
});

// Email is intentionally not accepted here: it is the permanent account identifier.
router.patch("/profile", requireAuth, writeRateLimit, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!existing) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (existing.role === "donor" && parsed.data.bloodType !== undefined) {
    updates.bloodType = parsed.data.bloodType;
  }
  if (existing.role === "hospital" && parsed.data.hospitalName !== undefined) {
    updates.hospitalName = parsed.data.hospitalName;
  }

  if (Object.keys(updates).length === 0) {
    res.json({ user: toPublicUser(existing) });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, req.userId!))
    .returning();

  res.json({ user: toPublicUser(updated!) });
});

export default router;
