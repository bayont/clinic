import prisma from "../../Prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { User, Session } from "../../types";
import createSession from "./createSession";
import { useRouter } from "next/router";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const user = JSON.parse(req.body) as User;
  const userPrisma = await prisma.user.create({ data: user });
  const session = await createSession(userPrisma);
  res.setHeader(
    "Set-Cookie",
    `session=${session.id}; path=/; expires=${new Date(
      session.expires
    ).toUTCString()}; HttpOnly; samesite=Strict`
  );
  if(req.headers.origin != null)
  res.setHeader("Location", req.headers.origin);
  res.status(201).send(`Dodano użytkownika ${user.login} do bazy danych!`);
}
