import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";

type RegisterRequest = {
  login: string;
  password: string;
};

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const prisma = new PrismaClient();
  const user = JSON.parse(req.body) as RegisterRequest;

  try {
    const resPrisma = await prisma.user.create({ data: user });
    res.status(200).send(`Dodano użytkownika ${user.login} do bazy danych!`);
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == "P2002") res.status(400).send("user_exist");
      else res.status(400).send("db_error");
    }
  }
}
