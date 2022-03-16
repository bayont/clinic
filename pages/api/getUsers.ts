import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "../../types";

export default async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  const prisma = new PrismaClient();
  const users: User[] = await prisma.user.findMany();
  res.status(200).json(users);
}
