import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../Prisma";

export default async function isLoginTaken(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  const body: string = req.body;
  try {
    const found = await prisma.user.findUnique({
      where: {
        login: body,
      },
    });
    if (found) {
      return res.status(200).send(true);
    }
    return res.status(200).send(false);
  } catch (e) {
    return res.status(200).send(false);
  }
}
