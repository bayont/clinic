import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../types";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { login } = req.query;
  const prisma = new PrismaClient();
  try {
    const user = (await prisma.user.findUnique({
      where: {
        login: login as string,
      },
    })) as User;
    user.password = "";
    res.status(200).json(JSON.stringify(user));
  } catch (e) {
    res.status(404).send("");
  }
}
