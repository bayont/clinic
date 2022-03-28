import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../Prisma";
import { User } from "../../../types";

type Query = {
  id?: string;
};
export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { id }: Query = req.query;
  if (!id) {
    res.status(404).send("Undefined");
    return;
  }
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
  })) as User;
  user.password = "";
  user.sessions = undefined;
  res.status(200).json(JSON.stringify(user));
}
