import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, usersTable, inventoryTable, bloodTypeEnum } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/password";
import { signSession, sessionCookieOptions, SESSION_COOKIE } from "../lib/jwt";
import { toPublicUser } from "../lib/public-user";
import { requireAuth } from "../middlewares/auth";
import { authRateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

const bloodTypeSchema = z.enum(bloodTypeEnum.enumValues);

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.").max(200),
    role: z.enum(["donor", "hospital"]),
    bloodType: bloodTypeSchema.optional(),
    hospitalName: z.string().trim().min(1).max(200).optional(),
  })
  .refine((data) => data.role !== "donor" || !!data.bloodType, {
    message: "Please select your blood type.",
    path: ["bloodType"],
  })
  .refine((data) => data.role !== "hospital" || !!data.hospitalName, {
    message: "Please provide your hospital name.",
    path: ["hospitalName"],
  });

router.post("/auth/register", authRateLimit, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }
  const { name, email, password, role, bloodType, hospitalName } = parsed.data;

  const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await hashPassword(password);

  const user = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash,
        role,
        bloodType: role === "donor" ? bloodType : null,
        hospitalName: role === "hospital" ? hospitalName : null,
      })
      .returning();

    if (role === "hospital" && created) {
      await tx.insert(inventoryTable).values(
        bloodTypeEnum.enumValues.map((type) => ({
          hospitalUserId: created.id,
          bloodType: type,
          units: 0,
        })),
      );
    }

    return created;
  });

  if (!user) {
    res.status(500).json({ error: "Could not create account." });
    return;
  }

  const token = signSession({ userId: user.id });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
  res.status(201).json({ user: toPublicUser(user) });
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

router.post("/auth/login", authRateLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid email and password." });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  const genericError = { error: "Invalid email or password." };
  if (!user) {
    res.status(401).json(genericError);
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json(genericError);
    return;
  }

  const token = signSession({ userId: user.id });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
  res.json({ user: toPublicUser(user) });
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions, maxAge: undefined });
  res.status(204).send();
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  res.json({ user: toPublicUser(user) });
});

export default router;
