import type { User } from "@workspace/db";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: "donor" | "hospital";
  bloodType: string | null;
  hospitalName: string | null;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bloodType: user.bloodType,
    hospitalName: user.hospitalName,
  };
}
