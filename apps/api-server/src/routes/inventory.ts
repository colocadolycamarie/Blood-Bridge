import { Router, type IRouter } from "express";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db, usersTable, inventoryTable, bloodTypeEnum } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { writeRateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

async function requireHospital(userId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user || user.role !== "hospital") return null;
  return user;
}

router.get("/inventory", requireAuth, async (req, res) => {
  const user = await requireHospital(req.userId!);
  if (!user) {
    res.status(403).json({ error: "Only hospital accounts have inventory." });
    return;
  }

  let rows = await db.select().from(inventoryTable).where(eq(inventoryTable.hospitalUserId, user.id));

  if (rows.length === 0) {
    rows = await db
      .insert(inventoryTable)
      .values(bloodTypeEnum.enumValues.map((type) => ({ hospitalUserId: user.id, bloodType: type, units: 0 })))
      .returning();
  }

  res.json({ inventory: rows });
});

const updateSchema = z.object({
  delta: z.number().int().min(-1000).max(1000),
});

router.patch("/inventory/:bloodType", requireAuth, writeRateLimit, async (req, res) => {
  const user = await requireHospital(req.userId!);
  if (!user) {
    res.status(403).json({ error: "Only hospital accounts have inventory." });
    return;
  }

  const bloodTypeResult = z.enum(bloodTypeEnum.enumValues).safeParse(req.params.bloodType);
  const bodyResult = updateSchema.safeParse(req.body);
  if (!bloodTypeResult.success || !bodyResult.success) {
    res.status(400).json({ error: "Invalid inventory update." });
    return;
  }

  const [row] = await db
    .select()
    .from(inventoryTable)
    .where(and(eq(inventoryTable.hospitalUserId, user.id), eq(inventoryTable.bloodType, bloodTypeResult.data)));

  if (!row) {
    res.status(404).json({ error: "Inventory row not found." });
    return;
  }

  const nextUnits = Math.max(0, row.units + bodyResult.data.delta);

  const [updated] = await db
    .update(inventoryTable)
    .set({ units: nextUnits, updatedAt: new Date() })
    .where(eq(inventoryTable.id, row.id))
    .returning();

  res.json({ item: updated });
});

export default router;
