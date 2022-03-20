import prisma from "../../Prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { User, Session } from "../../types";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const user = JSON.parse(req.body) as User;
  const userPrisma = await prisma.user.create({ data: user });
  const session = await prisma.session.create({
    data: {
      updated: new Date(),
      expires: new Date(),
      uID: userPrisma.id,
    },
  });

  res.status(200).send(`Dodano użytkownika ${user.login} do bazy danych!`);
}
